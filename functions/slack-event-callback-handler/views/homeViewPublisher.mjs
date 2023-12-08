import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

import { getSecret } from "../utilities/getSecret.mjs";
import { homeViewTemplate } from "./homeViewTemplate.mjs";

export const homeViewPublisher = async (userId, recordingsList) => {
  console.log("homeViewPublisher RECORDINGS VALUE CHECK", recordingsList);
  // get the Slack token from AWS Secrets Manager
  let token; // Variable to store the Slack Token
  try {
    const newToken = await getSecret("dev/slack-automation-app/slack-token");
    token = newToken.SLACK_TOKEN;
    console.log("Slack token ---", token);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  // creeate a slack client
  const slackClient = new WebClient(token);

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
