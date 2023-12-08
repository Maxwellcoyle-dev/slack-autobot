import axios from "axios";

export const sendToSlack = async (
  message,
  topic,
  meetingType,
  analysisType
) => {
  const slackWebhookUrl =
    "https://hooks.slack.com/services/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";

  try {
    const response = await axios.post(
      slackWebhookUrl,
      {
        text: `*${topic}*\nMEETING TYPE: ${meetingType}\nANALYSIS TYPE: ${analysisType}\n\n${message}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error in the sendToSlack --- ", error);
  }
};
