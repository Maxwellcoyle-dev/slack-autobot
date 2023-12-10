import { WebClient } from "@slack/web-api";

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// get the users email address
export const getUserEmail = async (userId) => {
  console.log("getUserEmail userId", userId);
  try {
    const response = await web.users.info({
      user: userId,
    });
    console.log("response", response);
    return response.user.profile.email;
  } catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};
