import axios from "axios";
import querystring from "querystring";

// Utilities
import { validateSlackRequest } from "/opt/nodejs/utilities/security.mjs";
import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

const SLACK_EVENT_CALLBACK_ENDPOINT = process.env.SLACK_EVENT_CALLBACK_ENDPOINT;
const SLACK_BLOCK_ACTION_ENDPOINT = process.env.SLACK_BLOCK_ACTION_ENDPOINT;

export const lambdaHandler = async (event) => {
  console.log("SLACK HANDLER TRIGGERED BY EVENT --- ", event);

  // Process the BODY of the Slack Request
  const { eventBody, eventType } = processBody(event);

  // Check if the Slack Event is an action with action_type = static_select
  // If yes, return a success to Slack + exit the function
  if (eventType === "block_actions") {
    const blockActionType = eventBody.actions[0]?.type; // Get the type of Slack Event
    if (blockActionType === "static_select") {
      console.log("return success for actionEventType --- ", blockActionType);
      // return a sucess to slack
      return {
        statusCode: 200,
        body: "",
      };
    } else if (actionEventType === "button") {
      console.log("return success for actionEventType --- ", blockActionType);
      // return a sucess to slack
      return {
        statusCode: 200,
        body: "",
      };
    }
  }

  // Check if the Slack Event is a URL Verification Event
  // If yes, return the challenge value sent by Slack + exit the function
  if (eventType === "url_verification") {
    return urlVerificationHandler(eventBody);
  }

  // Get the Slack Signing Secret from AWS Secrets Manager
  const signingSecret = await handleSigningSceret();

  // Validate the Slack Request usig the signingSecret + event
  // If the validation fails, return a 403 error + exit the function
  if (!validateSlackRequest(event, signingSecret)) {
    console.log("SLACK REQUEST VALIDATED --- FAILED");
    return {
      statusCode: 403,
      body: "Invalid signature",
    };
  } else {
    console.log("SLACK REQUEST VALIDATED --- Success");
  }

  try {
    // SLACK EVENT HANDLER
    switch (eventType) {
      case "event_callback":
        console.log("EVENT CALLBACK CASE MET");
        console.log("EVENT CALLBACK CASE MET - eventBody --- ", eventBody);
        try {
          await axios.post(SLACK_EVENT_CALLBACK_ENDPOINT, eventBody);
        } catch (error) {
          console.error("Slack API Error:", error);

          // Check if the error data has response_metadata
          if (error.data && error.data.response_metadata) {
            console.log("Response Metadata:", error.data.response_metadata);
          }
        }
        return {
          statusCode: 200,
          body: "slack handler event callback success message. eventBody sent to slack-event-callback-handler-function",
        };

      case "block_actions":
        console.log("BLOCK ACTIONS CASE MET");
        // Asynchronously handle the blockAction
        axios.post(SLACK_BLOCK_ACTION_ENDPOINT, eventBody);

        return {
          statusCode: 200,
          body: "slack handler block action success message. eventBody sent to slack-block-action-handler-function",
        };
      default:
        return {
          statusCode: 200,
          body: "",
        };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// ----------------------------------------------------------------

// Function to handle the URL Verification Event
const urlVerificationHandler = (body) => {
  // Return the challenge value sent by Slack
  return {
    statusCode: 200,
    body: body.challenge,
    headers: {
      "Content-Type": "text/plain",
    },
  };
};

// ----------------------------------------------------------------

// Function to process the BODY + Event Type of the Slack Request
const processBody = (event) => {
  const body =
    event.headers["Content-Type"] === "application/x-www-form-urlencoded"
      ? JSON.parse(querystring.parse(event.body).payload)
      : JSON.parse(event.body);

  const eventType = body.type; // Get the type of Slack Event
  const eventBody = body; // Get the body of the Slack Event

  console.log(
    "Process Body Function Returning - eventBody, eventType, userId --",
    {
      eventBody,
      eventType,
    }
  );
  return { eventBody, eventType };
};

// ----------------------------------------------------------------

// Function to get the Slack Signing Secret from AWS Secrets Manager
const handleSigningSceret = async () => {
  // Block to get the Slack Signing Secret -- Used to validate the Slack Request
  try {
    const newSigningSecret = await getSecret(
      "dev/slack-automation-app/slack-client"
    );
    const signingSecret = newSigningSecret.SLACK_SIGNING_SECRET;
    signingSecret && console.log("SIGNING SECRET --- Success");
    return signingSecret;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
