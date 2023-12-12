import { WebClient } from "@slack/web-api";
import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

// get the users email address
export const getUserEmail = async (userId) => {
  console.log("getUserEmail userId", userId);
  try {
    // Get the Slack Bot Token from AWS Secrets Manager
    const token = await getSecret("dev/slack-automation-app/slack-bot-token");
    const SLACK_BOT_TOKEN = token.SLACK_BOT_TOKEN;
    // Initialize the WebClient
    const slackClient = new WebClient(SLACK_BOT_TOKEN);

    // Call the users.info method using the WebClient
    const response = await slackClient.users.info({
      user: userId,
    });
    console.log("response", response);
    return response.user.profile.email;
  } catch (error) {
    console.error("Slack API Error:", error);

    throw new Error(error);
  }
};
