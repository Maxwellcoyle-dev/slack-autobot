import { getZoomRecording } from "./utilities/getZoomRecording.mjs";
import { transformVTT } from "./utilities/transformVTT.mjs";
import { openAiAnalyzerChain } from "./utilities/openAiAnalyzerChain.mjs";
import { sendToSlack } from "./utilities/sendToSlack.mjs";

export const lambdaHandler = async (event) => {
  try {
    console.log("Received raw event --- ", event);
    const payload = JSON.parse(event.body);
    console.log("Received body:", payload);

    // Extract required values from the event
    const slackUserId = payload.slackUserId; // The Slack user ID from the payload
    const downloadUrl = payload.downloadUrl; // The URL of the recording to download from the payload
    const meetingTopic = payload.meetingTopic; // The topic of the meeting from the payload
    const meetingType = payload.meetingType; // The type of meeting from the payload
    const analysisType = payload.analysisType; // The type of analysis from the payload

    // Download the recording
    const transcriptFile = await getZoomRecording(downloadUrl); // Download the recording

    // parse the VTT transcript file content to prep for OpenAI prompt
    const parsedTranscript = transformVTT(transcriptFile);
    console.log("parsedTranscript", parsedTranscript);

    // send the parsed transcript to OpenAI analyzer chain
    const openAIResult = await openAiAnalyzerChain(
      parsedTranscript,
      meetingType,
      analysisType,
      meetingTopic
    );
    console.log("result", openAIResult);

    // send the result of the openAI prompt + the meeting topic to a Slack Channel
    await sendToSlack(slackUserId, openAIResult.text);

    // Return a successful response
    return {
      statusCode: 200, // HTTP status code
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Success",
        // Include any other relevant information in the response
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    const payload = JSON.parse(event.body);
    const slackUserId = payload.slackUserId; // The Slack user ID from the payload

    try {
      await sendToSlack(
        slackUserId,
        `Sorry, something went wrong. \nNext Steps: \n1. Refresh the home page and try again. \n2. If the problem persists, please send Max a message in Slack.`
      );
    } catch (error) {
      await sendToSlack(
        `max.henderson@trainicity.com`,
        `A user is experiencing an error in the transcript-handler lambda function. \nError: ${error} \nEvent: ${event}`
      );
    }

    // Return an error response
    return {
      statusCode: 500, // Internal Server Error
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message, // Optionally include error details
      }),
    };
  }
};
