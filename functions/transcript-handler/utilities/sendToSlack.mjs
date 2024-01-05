import { WebClient } from "@slack/web-api";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

const ENVIRONMENT = process.env.ENVIRONMENT;

export const sendToSlack = async (slackUserId, message) => {
  try {
    // get token from aws secret manager
    const newToken = await getSecret(
      `slack-call-analyzer/bot-user-oauth-token/${ENVIRONMENT}`
    );
    const BOT_USER_OAUTH_TOKEN = newToken.BOT_USER_OAUTH_TOKEN;
    // create slack client
    const slackClient = new WebClient(BOT_USER_OAUTH_TOKEN);

    const response = await slackClient.chat.postMessage({
      channel: slackUserId,
      text: message,
    });
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error in the sendToSlack --- ", error);
  }
};
