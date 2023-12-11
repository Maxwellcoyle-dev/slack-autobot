import { WebClient } from "@slack/web-api";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

export const sendToSlack = async (
  slackUserId,
  message,
  topic,
  meetingType,
  analysisType
) => {
  try {
    // get token from aws secret manager
    const newToken = await getSecret(
      "dev/slack-automation-app/slack-bot-token"
    );
    const SLACK_BOT_TOKEN = newToken.SLACK_BOT_TOKEN;
    // create slack client
    const slackClient = new WebClient(SLACK_BOT_TOKEN);

    const response = await slackClient.chat.postMessage({
      channel: slackUserId,
      text: `*${topic}*\nMEETING TYPE: ${meetingType}\nANALYSIS TYPE: ${analysisType}\n\n${message}`,
    });
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error in the sendToSlack --- ", error);
  }
};
