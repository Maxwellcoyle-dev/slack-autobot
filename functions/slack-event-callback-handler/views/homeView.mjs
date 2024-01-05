import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

import { getSecret } from "../utilities/getSecret.mjs";
import { listRecordings } from "../utilities/listRecordings.mjs";

const ENVIRONMENT = process.env.ENVIRONMENT;

// get the slack bot token from AWS Secrets Manager
const newToken = await getSecret(
  `slack-call-analyzer/bot-user-oauth-token/${ENVIRONMENT}`
);
const BOT_USER_OAUTH_TOKEN = newToken.BOT_USER_OAUTH_TOKEN;

// create a slack client
const slackClient = new WebClient(BOT_USER_OAUTH_TOKEN);

export const publishHomeView = async (userId) => {
  const recordingsPayload = await listRecordings();
  const meetingsList = recordingsPayload.data.meetings;
  console.log("recordings", meetingsList);
  console.log("meetingsList", meetingsList);

  try {
    console.log("publishing home view for user: ", userId);
    const result = await slackClient.views.publish({
      user_id: userId,
      view: viewPayload,
    });
    console.log("View published: ", result);
    return result;
  } catch (error) {
    console.error("Error publishing view: ", error);
  }
};
