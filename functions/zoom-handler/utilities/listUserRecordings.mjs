import axios from "axios";

// get todays date in 'yyyy-mm-dd' UTC format
const today = new Date();
const initialToDate = today.toISOString().split("T")[0];

// get 7 days ago in 'yyyy-mm-dd' UTC format
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const initialFromDate = sevenDaysAgo.toISOString().split("T")[0];

export const listUserRecordings = async (
  userId,
  fromDate = initialFromDate,
  toDate = initialToDate,
  token
) => {
  try {
    const usersRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const recordingsEndpoint = `https://api.zoom.us/v2/users/${userId}/recordings?from=${fromDate}&to=${toDate}`;

    console.log(
      "LIST USER RECORDINGS ZOOM REQUEST FIRING WITH URL ---",
      recordingsEndpoint
    );

    const listRecordings = await axios.get(
      recordingsEndpoint,
      usersRequestConfig
    );
    console.log(listRecordings.data);
    return listRecordings.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error getting recordings for USER: ${userId} from the Zoom API ---`,
      error
    );
  }
};
