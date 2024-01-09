import { WebClient } from "@slack/web-api";
import axios from "axios";

import { homeViewUpdater } from "../views/homeViewUpdater.mjs";

import { modalViewTemplate } from "../modalViewTemplate.mjs";
import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";
import { getUserEmail } from "/opt/nodejs/utilities/getSlackUser.mjs";

const LIST_RECORDINGS_ENDPOINT = process.env.LIST_RECORDINGS_ENDPOINT;
const ENVIRONMENT = process.env.ENVIRONMENT;

export const blockActionHandler = async (payload) => {
  console.log("ACTION HANDLER - BODY --- ", payload);

  // Get the Slack Bot Token from AWS Secrets Manager
  const newToken = await getSecret(
    `slack-call-analyzer/bot-user-oauth-token/${ENVIRONMENT}`
  );
  const BOT_USER_OAUTH_TOKEN = newToken.BOT_USER_OAUTH_TOKEN;
  const slackClient = new WebClient(BOT_USER_OAUTH_TOKEN);

  const actionType = payload.actions[0].action_id.split("-")[0];
  console.log("actionType --- ", actionType);

  try {
    switch (actionType) {
      case "open_modal":
        // get the actionValuePayload
        const actionValuePayload = JSON.parse(payload.actions[0].value);
        console.log("actionValuePayload --- ", actionValuePayload);
        // SLACK MODAL PAYLOAD
        const slackModalPayload = slackModalPayloadBuilder(
          payload,
          actionValuePayload
        );
        // Open the modal
        await slackClient.views
          .open(slackModalPayload)
          .then((result) => {
            console.log("slackClient.views.open --- ", result);
          })
          .catch((error) => {
            console.log("slackClient.views.open --- ", error);
            throw error;
          });

        return {
          statusCode: 200,
          body: JSON.stringify({
            message:
              "Slack block action handler executed successfully for Action OPEN_MODAL!",
          }),
        };
      case "search_meeting_action":
        console.log("payload.state.values --- ", payload.view.state.values);
        // Retrieve the first key from the values object, assuming there's only one such key
        const outerKey = Object.keys(payload.view.state.values)[0];

        // Use the outerKey to access the date values
        const fromDate =
          payload.view.state.values[outerKey].from_date_action.selected_date;
        const toDate =
          payload.view.state.values[outerKey].to_date_action.selected_date;
        console.log("fromDate --- ", fromDate);
        console.log("toDate --- ", toDate);

        const viewId = payload.view.id;

        // use slack id to get user email for zoom api
        const slackUserId = payload.user.id;
        const slackUserEmail = await getUserEmail(slackUserId);

        const recordingsList = await axios.get(LIST_RECORDINGS_ENDPOINT, {
          params: {
            user_id: slackUserEmail,
            from: fromDate,
            to: toDate,
            eventType: "list-user-recordings",
          },
        });
        console.log("recordingsList --- ", recordingsList.data);

        // Get the first 30 recordings
        const updatedRecordingsList = recordingsList.data.recordings.splice(
          0,
          20
        );
        console.log("updatedRecordingsList --- ", updatedRecordingsList);

        const updateHomeViewResponse = await homeViewUpdater(
          slackUserId,
          viewId,
          updatedRecordingsList,
          fromDate,
          toDate
        );
        console.log("updateHomeViewResponse --- ", updateHomeViewResponse);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message:
              "Slack block action handler executed successfully for Action SEARCH_MEETING_ACTION!",
          }),
        };

      default:
        console.log("default");
        throw new Error("Invalid actionType: ", actionType);
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const slackModalPayloadBuilder = (eventPayload, actionValuePayload) => {
  // Get the build a actionUuid for the action_id in the modal
  const actionUuid = eventPayload.actions[0].action_id.split("-")[1];

  console.log(
    "actionValuePayload.downloadUrl --- ",
    actionValuePayload.downloadUrl
  );

  const slackModalPayload = {
    trigger_id: eventPayload.trigger_id,
    view: modalViewTemplate(
      actionUuid,
      actionValuePayload.meetingTopic,
      actionValuePayload.downloadUrl
    ),
  };
  console.log("slackModalPayload --- ", slackModalPayload);
  return slackModalPayload;
};
