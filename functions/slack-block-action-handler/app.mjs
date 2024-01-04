import querystring from "querystring";

import { viewSubmissionHandler } from "./event-type-handlers/viewSubmissionHandler.mjs";
import { blockActionHandler } from "./event-type-handlers/blockActionHandler.mjs";

export const lambdaHandler = async (event) => {
  try {
    console.log("SLACK BLOCK ACTION HANDLER TRIGGERED BY EVENT --- ", event);
    const eventPayload = JSON.parse(querystring.parse(event.body).payload);
    console.log("EVENT PAYLOAD --- ", eventPayload);

    switch (eventPayload.type) {
      case "block_actions":
        console.log("EVENT TYPE --- ", eventPayload.type);

        // check of the action type is datepicker
        // If yes, then return 200 success
        const actionType = eventPayload.actions[0].type;
        if (actionType === "datepicker") {
          console.log("return success for action type --- ", actionType);
          return {
            statusCode: 200,
          };
        }

        const blockHandlerResponse = await blockActionHandler(eventPayload);
        return blockHandlerResponse;

      case "view_submission":
        console.log("EVENT TYPE --- ", eventPayload.type);
        const viewSubmissionResponse = await viewSubmissionHandler(
          eventPayload
        );
        return viewSubmissionResponse;
      default:
        console.log("EVENT TYPE --- Default Case Met ", eventPayload.type);
        return {
          statusCode: 200,
        };
    }
  } catch (error) {
    console.log("ERROR --- ", error);
    if (error.data && error.data.response_metadata) {
      console.log(error.data.response_metadata);
    }
    throw new Error(error);
  }
};
