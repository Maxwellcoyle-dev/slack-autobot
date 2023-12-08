import axios from "axios";
import querystring from "querystring";

export const getOathToken = async (accountId, clientId, clientSecret) => {
  try {
    // Encode the Client ID and Client Secret to Base64
    const base64Credentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");
    // Get a Token using account_credentials for the Zoom API
    const tokenEndpoint = "https://zoom.us/oauth/token";
    const requestBody = querystring.stringify({
      grant_type: "account_credentials",
      account_id: accountId,
    });

    const requestConfig = {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // Make a POST request to the Zoom OAuth API
    const returnToken = await axios.post(
      tokenEndpoint,
      requestBody,
      requestConfig
    );

    // Get the token from the response
    const token = await returnToken.data.access_token;

    // Return the token
    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting OAth token from the Zoom API --- ", error);
  }
};
