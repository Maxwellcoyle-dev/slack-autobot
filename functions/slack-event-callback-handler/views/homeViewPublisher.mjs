import { WebClient } from "@slack/web-api";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";
import { homeViewTemplate } from "./homeViewTemplate.mjs";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export const homeViewPublisher = async (userId, recordingsList) => {
  console.log("homeViewPublisher RECORDINGS VALUE CHECK", recordingsList);

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
