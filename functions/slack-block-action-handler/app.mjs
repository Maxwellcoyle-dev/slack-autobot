import querystring from "querystring";

import { viewSubmissionHandler } from "./event-type-handlers/viewSubmissionHandler.mjs";
import { blockActionHandler } from "./event-type-handlers/blockActionHandler.mjs";

export const lambdaHandler = async (event) => {
  try {
    console.log("EVENT --- ", event);
    const eventPayload = JSON.parse(querystring.parse(event.body).payload);
    console.log("EVENT PAYLOAD --- ", eventPayload);

    const eventPayloadType = eventPayload.type;
    console.log("EVENT TYPE --- ", eventPayloadType);

    switch (eventPayloadType) {
      // Possible Payload Types:
      // 1. block_actions
      // 2. view_submission

      case "block_actions":
        console.log("EVENT TYPE --- ", eventPayload.type);

        // check if the action type is datepicker
        // If yes, then return 200 success
        const actionType = eventPayload.actions[0].type;
        // Possible Action Types:
        // 1. datepicker - do nothing
        // 2. open_modal - blockHandlerResponse - open modal
        switch (actionType) {
          case "datepicker":
            console.log("return success for action type --- ", actionType);
            return {
              statusCode: 200,
            };
          case "button":
            const blockHandlerResponse = await blockActionHandler(eventPayload);
            return blockHandlerResponse;

          default:
            console.log("Default Case Met. EVENT TYPE ---  ", actionType);
            break;
        }

      case "view_submission":
        console.log("EVENT TYPE --- ", eventPayload.type);
        const viewSubmissionResponse = await viewSubmissionHandler(
          eventPayload
        );
        return viewSubmissionResponse;
      default:
        console.log("Default Case Met. EVENT TYPE ---  ", eventPayload.type);
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
