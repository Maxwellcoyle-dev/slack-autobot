import { listRecordings } from "/opt/nodejs/utilities/listRecordings.mjs";

import { homeViewPublisher } from "./views/homeViewPublisher.mjs";

export const lambdaHandler = async (event) => {
  console.log("SLACK HANDLER TRIGGERED BY EVENT --- ", event);
  const eventPayload = JSON.parse(event.body);
  console.log("EVENT PAYLOAD --- ", eventPayload);

  // Get the recordings list for the user
  const userId = eventPayload.event.user;

  const recordingsList = await listRecordings(userId);

  // Publish the home view
  const result = await homeViewPublisher(userId, recordingsList);

  //
};
