import axios from "axios";

import { getUserEmail } from "/opt/nodejs/utilities/getSlackUser.mjs";

import { homeViewPublisher } from "./views/homeViewPublisher.mjs";

const ZOOM_LIST_RECORDINGS_URL = process.env.LIST_RECORDINGS_ENDPOINT;

export const lambdaHandler = async (event) => {
  try {
    console.log("SLACK HANDLER TRIGGERED BY EVENT --- ", event);

    const eventPayload = JSON.parse(event.body);
    const eventType = eventPayload?.type;

    console.log("EVENT PAYLOAD --- ", eventPayload);
    console.log("EVENT TYPE --- ", eventType);

    // Check if the Slack Event is a URL Verification Event
    // If yes, return the challenge value sent by Slack + exit the function
    if (eventType === "url_verification") {
      return urlVerificationHandler(eventPayload);
    }

    // Get the recordings list for the user
    const slackUserId = eventPayload?.event?.user;

    const slackUserEmail = await getUserEmail(slackUserId);

    const recordingsList = await axios.get(ZOOM_LIST_RECORDINGS_URL, {
      params: {
        user_id: slackUserEmail,
        from: undefined,
        to: undefined,
        eventType: "list-user-recordings",
      },
    });

    // Publish the home view
    const result = await homeViewPublisher(slackUserId, recordingsList);

    console.log("RESULT --- ", result);

    // return success
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Slack event callback handler executed successfully!",
        input: event,
      }),
    };
  } catch (error) {
    console.log("ERROR --- ", error);

    throw new Error(error);
  }
};

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
