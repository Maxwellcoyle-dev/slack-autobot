import { WebClient } from "@slack/web-api";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";
import { homeViewTemplate } from "./homeViewTemplate.mjs";

export const homeViewPublisher = async (userId, recordingsList) => {
  console.log("homeViewPublisher RECORDINGS VALUE CHECK", recordingsList);

  // Get the Slack Bot Token from AWS Secrets Manager
  const newToken = await getSecret("dev/slack-automation-app/slack-bot-token");
  const SLACK_BOT_TOKEN = newToken.SLACK_BOT_TOKEN;
  // creeate a slack client
  const slackClient = new WebClient(SLACK_BOT_TOKEN);

  try {
    console.log("publishing home view for user: ", userId);
    const homeViewPayload = homeViewTemplate(recordingsList);
    console.log("homeViewPayload", homeViewPayload);
    const result = await slackClient.views.publish({
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
