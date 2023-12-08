import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

import { getSecret } from "../utilities/getSecret.mjs";
import { listRecordings } from "../utilities/listRecordings.mjs";

const newToken = await getSecret("dev/slack-automation-app/slack-token");
const token = newToken.SLACK_TOKEN;

const slackClient = new WebClient(token);

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
