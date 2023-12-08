import axios from "axios";

const ZOOM_LIST_RECORDINGS_URL = process.env.ZOOM_LIST_RECORDINGS_ENDPOINT;

// INOMING SCHEMA
// {
//   "user_id": "",
//   "start_date": "",
//   "end_date": ""
// }

// get todays date in 'yyyy-mm-dd' UTC format
const today = new Date();
const initialToDate = today.toISOString().split("T")[0];

// get 7 days ago in 'yyyy-mm-dd' UTC format
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const initialFromDate = sevenDaysAgo.toISOString().split("T")[0];

export const listRecordings = async (
  userId,
  fromDate = initialFromDate,
  toDate = initialToDate
) => {
  try {
    const payload = {
      user_id: userId,
      from: fromDate,
      to: toDate,
      eventType: "list-user-recordings",
    };

    console.log("LIST RECORDINGS TRIGGERED - PAYLOAD --- ", payload);

    const response = await axios.get(ZOOM_LIST_RECORDINGS_URL, {
      params: payload,
    });
    console.log("LIST RECORDINGS - RESPONSE --- ", response);
    return response.data;
  } catch (error) {
    console.log("LIST RECORDINGS - ERROR", error);
    throw new Error(error);
  }
};
