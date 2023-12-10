import { listUserRecordings } from "./utilities/listUserRecordings.mjs";
import { downloadFile } from "./utilities/downloadFile.mjs";
import { getSecret } from "./utilities/getSecret.mjs";
import { getOathToken } from "./utilities/getOathToken.mjs";

// INCOMING PAYLOAD
// {
//   "user_id": "",
//   "start_date": "",
//   "end_date": ""
// }

// ZOOM ACCOUNT ID AND CLIENT ID - YAML DEFINED ENV VARIABLES
const clientId = process.env.ZOOM_CLIENT_ID;
const accountId = process.env.ZOOM_ACCOUNT_ID;

// ZOOM CLIENT SECRET NAME - AWS SECRETS MANAGER SECRET NAME
const zoomClientSecretName = "dev/slack-automation-app/zoom-client";

export const lambdaHandler = async (event) => {
  let clientSecret; // Variable to store the Zoom Client Secret
  // Block to get the Zoom Client Secret -- Used to get Zoom OAuth Token
  try {
    // Get the Zoom Client Secret from AWS Secrets Manager
    // Send the Zoom Client Secret Name to the getSecret function
    const secret = await getSecret(zoomClientSecretName);
    // get secret value from secret object
    clientSecret = secret.ZOOM_CLIENT_SECRET;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  let token; // Variable to store the OAuth Token
  try {
    // Get the OAuth Token from the Zoom API
    // Send the Zoom Account ID, Client ID, and Zoom CLient Secret Name to the getOathToken function
    token = await getOathToken(accountId, clientId, clientSecret);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  console.log("APP.JS - EVENT --- ", event);
  let payload; // Variable to store the incoming payload

  switch (event.httpMethod) {
    case "GET":
      console.log("GET REQUEST");
      payload = event.queryStringParameters;
      break;
    case "POST":
      console.log("POST REQUEST");
      payload = JSON.parse(event.body);
      break;
    default:
      console.log("DEFAULT REQUEST");
      break;
  }

  console.log("APP.JS - EVENT PAYLOAD --- ", payload);

  const eventType = payload.eventType; // Variable to store the incoming request type

  // Switch Statement to handle the incoming request type & call the appropriate function
  try {
    switch (eventType) {
      case "list-user-recordings":
        console.log("LIST USER RECORDINGS - PAYLOAD --- ", payload);
        const userId = payload.user_id; // Variable to store the user_id
        const fromDate = payload.from; // Variable to store the start_date
        const toDate = payload.to; // Variable to store the end_date
        // Call the listUserRecordings function
        const listUserRecordingResponse = await listUserRecordings(
          userId,
          fromDate,
          toDate,
          token
        );
        console.log(
          "LIST USER RECORDINGS - RESPONSE --- ",
          listUserRecordingResponse
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            recordings: listUserRecordingResponse,
          }),
        };
      case "download-recording-transcript":
        console.log("DOWNLOAD RECORDING TRANSCRIPT --- ", payload);
        const downloadUrl = payload.downloadUrl; // Variable to store the download_url
        console.log("downloading URL --- ", downloadUrl);

        const downloadFileResponse = await downloadFile(downloadUrl, token); // Call the Zoom API to get the transcript
        console.log("transcript --- ", downloadFileResponse);
        return {
          statusCode: 200,
          body: JSON.stringify({
            transcript: downloadFileResponse,
          }),
        };
    }
  } catch (error) {
    console.error("Error encountered in lambdaHandler", {
      errorMessage: error.message,
      stack: error.stack,
      event, // Log the original event for context
      // You can add more context here if necessary
    });

    // Return a generic error message to the client
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
