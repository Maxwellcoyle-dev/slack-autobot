import { listRecordings } from "./utilities/listRecordings.mjs";
import { getUserEmail } from "/opt/nodejs/utilities/getSlackUser.mjs";

import { homeViewPublisher } from "./views/homeViewPublisher.mjs";

export const lambdaHandler = async (event) => {
  try {
    console.log("SLACK HANDLER TRIGGERED BY EVENT --- ", event);
    const eventPayload = JSON.parse(event.body);
    console.log("EVENT PAYLOAD --- ", eventPayload);

    // Get the recordings list for the user
    const slackUserId = eventPayload.event.user;

    const slackUserEmail = await getUserEmail(slackUserId);
    const recordingsList = await listRecordings(slackUserEmail);

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
