import axios from "axios";
import { WebClient } from "@slack/web-api";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

const TRANSCRIPT_HANDLER_URL = process.env.TRANSCRIPT_HANDLER_ENDPOINT;

export const viewSubmissionHandler = async (payload) => {
  try {
    console.log("ACTION HANDLER - ACTION: select_transcript_action");

    const transcriptPayload = transcriptHandlerPayloadBuilder(payload);

    // Call the transcript handler
    axios.post(TRANSCRIPT_HANDLER_URL, transcriptPayload);

    // Get the Slack Bot Token from AWS Secrets Manager
    const newToken = await getSecret(
      "dev/slack-automation-app/slack-bot-token"
    );
    const SLACK_BOT_TOKEN = newToken.SLACK_BOT_TOKEN;
    // creeate a slack client with the bot token
    const slackClient = new WebClient(SLACK_BOT_TOKEN);

    // Notify the user that processing has started
    await slackClient.chat
      .postMessage({
        channel: payload.user.id, // or appropriate channel/user
        text: "Processing your transcript request. I'll notify you once it's ready!",
      })
      .then((res) => {
        console.log("Message sent: ", res.ts);
      })
      .catch(console.error);

    return {
      statusCode: 200,
      body: JSON.stringify({
        response_action: "clear",
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error,
      }),
    };
  }
};

const transcriptHandlerPayloadBuilder = (eventPayload) => {
  const metaData = eventPayload.view.private_metadata;

  const transcriptPayload = {
    downloadUrl: JSON.parse(metaData).downloadUrl,
    meetingTopic: JSON.parse(metaData).meetingTopic,
    zoomEventType: "download-recording-transcript",
    meetingType: JSON.parse(
      eventPayload.view.blocks[0].element.options[0].value
    ).meetingType,
    analysisType: JSON.parse(
      eventPayload.view.blocks[0].element.options[0].value
    ).analysisType,
  };
  console.log("transcriptPayload --- ", transcriptPayload);
  return transcriptPayload;
};
