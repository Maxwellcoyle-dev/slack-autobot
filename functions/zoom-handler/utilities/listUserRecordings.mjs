import axios from "axios";

export const listUserRecordings = async (userId, fromDate, toDate, token) => {
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
