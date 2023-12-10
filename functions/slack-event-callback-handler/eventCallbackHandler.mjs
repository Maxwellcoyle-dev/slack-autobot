import { listRecordings } from "../utilities/listRecordings.mjs";
import { homeViewPublisher } from "../views/homeViewPublisher.mjs";

const ZOOM_USER_ID = process.env.ZOOM_USER_ID;

export const eventCallbackHandler = async (userId) => {
  // get the initial list of call recordings
  const listRecordingsResponse = await listRecordings(ZOOM_USER_ID);
  console.log(
    "event_callback - LIST RECORDINGS RESPONSE VALUE --- ",
    listRecordingsResponse
  );

  const recordingList = listRecordingsResponse.recordings.meetings;
  console.log("event_callback - recordingList ---- ", recordingList);
  // Check recordingList.recording_files[].file_type for "VTT"
  // If VTT, then add to the recordingTranscriptList
  let recordingTranscriptList = [];
  recordingList.forEach((meeting) => {
    meeting.recording_files.forEach((file) => {
      if (file.file_type === "TRANSCRIPT") {
        const fileData = {
          meetingUuid: meeting.uuid,
          meetingId: meeting.id,
          meetingTopic: meeting.topic,
          downloadUrl: file.download_url,
          meetingDuration: meeting.duration,
          startTime: meeting.start_time,
          shareDetails: {
            shareUrl: meeting.share_url,
            sharePasscode: meeting.recording_play_passcode,
          },
        };
        recordingTranscriptList.push(fileData);
      }
    });
  });

  console.log("recordingTranscriptList -- ", recordingTranscriptList);
  if (recordingTranscriptList.length === 0) {
    throw new Error("No TRANSCRIPT files found");
  }
  await homeViewPublisher(userId, recordingTranscriptList);
};
