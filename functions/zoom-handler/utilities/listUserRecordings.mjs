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
    console.log("example of meetings ", listRecordings.data.meetings);
    console.log(
      "example of meetings[i].recording_files --- ",
      listRecordings.data.meetings[0].recording_files
    );
    console.log(
      "example of meetings[i].recording_files --- ",
      listRecordings.data.meetings[1].recording_files
    );

    const recordingsTranscriptList = listRecordings.data.meetings
      .filter(
        (meeting) =>
          meeting.duration > 1 &&
          meeting.recording_files.some((file) => file.file_extension === "VTT")
      ) // Filter for duration and VTT file
      .map((meeting) => {
        const vttFile = meeting.recording_files.find(
          (file) => file.file_extension === "VTT"
        );

        const utcDate = new Date(meeting.start_time);
        const timeZoneFormattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: meeting.timezone,
        }).format(utcDate);

        const recordingSchema = {
          meetingUuid: meeting.uuid,
          meetingTopic: meeting.topic,
          meetingDate: timeZoneFormattedDate,
          meetingDuration: meeting.duration,
          downloadUrl: vttFile?.download_url,
        };
        console.log("recordingSchema --- ", recordingSchema);
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
