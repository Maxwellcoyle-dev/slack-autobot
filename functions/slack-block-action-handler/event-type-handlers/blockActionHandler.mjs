import { WebClient } from "@slack/web-api";

import { modalViewTemplate } from "../modalViewTemplate.mjs";
import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

export const blockActionHandler = async (payload) => {
  console.log("ACTION HANDLER - BODY --- ", payload);

  // Get the Slack Bot Token from AWS Secrets Manager
  const newToken = await getSecret("dev/slack-automation-app/slack-bot-token");
  const SLACK_BOT_TOKEN = newToken.SLACK_BOT_TOKEN;
  const slackClient = new WebClient(SLACK_BOT_TOKEN);

  // get the actionValuePayload
  const actionValuePayload = JSON.parse(payload.actions[0].value);

  // SLACK MODAL PAYLOAD
  const slackModalPayload = slackModalPayloadBuilder(
    payload,
    actionValuePayload
  );

  const actionType = payload.actions[0].action_id.split("-")[0];
  console.log("actionType --- ", actionType);

  try {
    switch (actionType) {
      case "open_modal":
        console.log("ACTION HANDLER - ACTION: open_modal");
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
      case "search_meetings":
        console.log("ACTION HANDLER - ACTION: search-meeting-action");
        break;

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
