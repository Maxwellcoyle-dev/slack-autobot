import axios from "axios";
import { WebClient } from "@slack/web-api";

import { modalViewTemplate } from "../views/modalViewTemplate.mjs";

const TRANSCRIPT_HANDLER_URL = process.env.TRANSCRIPT_HANDLER_ENDPOINT;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(SLACK_BOT_TOKEN);

export const blockActionHandler = async (payload, userId) => {
  console.log("ACTION HANDLER - BODY --- ", payload);

  const actionId = payload.actions[0].action_id;
  console.log("action handler - actionId -- ", actionId);
  const actionValuePayload = JSON.parse(payload.actions[0].value);
  console.log("action handler - actionValuePayload -- ", actionValuePayload);
  const downloadUrl = actionValuePayload.downloadUrl;
  console.log("action handler - downloadUrl -- ", downloadUrl);
  const meetingTopic = actionValuePayload.meetingTopic;
  console.log("action handler - meetingTopic -- ", meetingTopic);
  const actionType = actionId.split("-")[0];
  console.log("action handler - actionType -- ", actionType);
  const actionUuid = actionId.split("-")[1];
  console.log("action handler - actionUuid -- ", actionUuid);

  const meetingTypeActionId = `select_meeting_type-${actionUuid}`;
  console.log("meetingTypeActionId --- ", meetingTypeActionId);
  const analysisTypeActionId = `select_analysis_type-${actionUuid}`;
  console.log("analysisTypeActionId --- ", analysisTypeActionId);

  const blockId = payload.actions[0].block_id; // Get the block_id for the incoming action
  console.log("blockId --- ", blockId);

  // const meetingType =
  //   payload.view.state.values[blockId][meetingTypeActionId].selected_option
  //     .value;
  // const analysisType =
  //   payload.view.state.values[blockId][analysisTypeActionId].selected_option
  //     .value;
  // console.log("meetingType --- ", meetingType);
  // console.log("analysisType --- ", analysisType);

  try {
    switch (actionType) {
      case "search_meetings":
        console.log("ACTION HANDLER - ACTION: search-meeting-action");
        break;
      case "analyze_transcript":
        console.log("ACTION HANDLER - ACTION: select_transcript_action");

        axios
          .post(TRANSCRIPT_HANDLER_URL, {
            downloadUrl,
            meetingTopic,
            zoomEventType: "download-recording-transcript",
            meetingType,
            analysisType,
          })
          .then((response) => {
            // Notify the user once processing is complete
            web.chat.postMessage({
              channel: userId, // or appropriate channel/user
              text: "Your transcript is ready!",
            });
          })
          .catch((error) => {
            console.error("Error in processing transcript: ", error);
            // Handle error appropriately
          });

        break;
      case "open_modal":
        console.log("ACTION HANDLER - ACTION: open_modal");
        await web.views.open({
          trigger_id: payload.trigger_id, // Ensure you get this from the payload
          view: modalViewTemplate(actionUuid, meetingTopic, downloadUrl),
        });
      default:
        console.log("default");
        throw new Error("Invalid actionType: ", actionType);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
