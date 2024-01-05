import { WebClient } from "@slack/web-api";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";
import { homeViewTemplate } from "/opt/nodejs/homeViewTemplate.mjs";

const ENVIRONMENT = process.env.ENVIRONMENT;

export const homeViewUpdater = async (
  userId,
  viewId,
  recordingsList,
  fromDate,
  toDate
) => {
  console.log("homeViewPublisher RECORDINGS VALUE CHECK", recordingsList);

  // Get the Slack Bot Token from AWS Secrets Manager
  const newToken = await getSecret(
    `slack-call-analyzer/bot-user-oauth-token/${ENVIRONMENT}`
  );
  const BOT_USER_OAUTH_TOKEN = newToken.BOT_USER_OAUTH_TOKEN;
  // creeate a slack client
  const slackClient = new WebClient(BOT_USER_OAUTH_TOKEN);

  try {
    const homeViewPayload = homeViewTemplate(recordingsList, fromDate, toDate);
    console.log("homeViewPayload", homeViewPayload);
    const result = await slackClient.views.update({
      view_id: viewId,
      user_id: userId,
      view: homeViewPayload,
    });
    console.log("View published: ", result);
    console.log("View published: ", result.view.state.values);
    return result;
  } catch (error) {
    console.error("Error publishing view: ", error);
    console.log(
      "Error publishing view: ",
      error.data.response_metadata.messages
    );
  }
};
