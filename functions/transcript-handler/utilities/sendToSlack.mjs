import axios from "axios";
import { WebClient } from "@slack/web-api";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(SLACK_BOT_TOKEN);

export const sendToSlack = async (
  message,
  topic,
  meetingType,
  analysisType
) => {
  try {
    const response = await slackClient.chat.postMessage({
      channel: "autobot-testing",
      text: `*${topic}*\nMEETING TYPE: ${meetingType}\nANALYSIS TYPE: ${analysisType}\n\n${message}`,
    });
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error in the sendToSlack --- ", error);
  }
};
