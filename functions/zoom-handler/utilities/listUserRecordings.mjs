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
    console.log("raw recording data list --- ", listRecordings.data);
    console.log(
      "example of meetings[i].recording_files --- ",
      listRecordings.data.meetings[0].recording_files
    );
    console.log(
      "example of meetings[i].recording_files --- ",
      listRecordings.data.meetings[1].recording_files
    );

    const recordingsTranscriptList = listRecordings.data.meetings
      .filter((meeting) => meeting.duration > 1) // Add this line to filter meetings
      .map((meeting) => {
        const recordingSchema = {
          meetingUuid: meeting.uuid,
          meetingTopic: meeting.topic,
          meetingDate: meeting.start_time,
          meetingTimeZone: meeting.timezone,
          meetingDuration: meeting.duration,
          downloadUrl: meeting.recording_files.filter(
            (file) => file.file_extension === "VTT"
          )[0]?.download_url,
        };
        return recordingSchema;
      });

    console.log("recordingsTranscriptList --- ", recordingsTranscriptList);
    return recordingsTranscriptList;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Error getting recordings for USER: ${userId} from the Zoom API ---`,
      error
    );
  }
};
