// FORMAT DATA HELPER FUNCTION - Used to format the date and time of the meeting
const formatData = (dateStr) => {
  const dateObj = new Date(dateStr);
  const dateString = dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const timeString = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dayString = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
  });
  return `${dayString} - ${dateString} - ${timeString}`;
};

// get todays date in 'YYYY-MM-DD'format
const today = new Date();
const initialToDate = today.toISOString().split("T")[0];
console.log("initialToDate", initialToDate);

// get 7 days ago in 'YYYY-MM-DD' format
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const initialFromDate = sevenDaysAgo.toISOString().split("T")[0];
console.log("initialFromDate", initialFromDate);

// HOME VIEW TEMPLATE - Used to create the home view
export const homeViewTemplate = (
  meetingsList,
  fromDate = initialFromDate,
  toDate = initialToDate
) => {
  console.log("meetingsList from the homeViewTemplate", meetingsList);

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Slack Autobot",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Combine your Zoom call recordings with the power of AI.",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Select a date range*",
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: "Choose the start and end dates for your search.",
          emoji: true,
        },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "datepicker",
          initial_date: `${fromDate}`,
          placeholder: {
            type: "plain_text",
            text: "Select start date",
            emoji: true,
          },
          action_id: "from_date_action",
        },
        {
          type: "datepicker",
          initial_date: `${toDate}`,
          placeholder: {
            type: "plain_text",
            text: "Select end date",
            emoji: true,
          },
          action_id: "to_date_action",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Search",
            emoji: true,
          },
          value: "search",
          action_id: "search_meeting_action",
        },
      ],
    },
    {
      type: "divider",
    },
  ];

  try {
    meetingsList.forEach((meeting) => {
      console.log("meeting", meeting);
      console.log(meeting.recording_files);
      console.log(meeting.recording_files[0]);
      // Values from the meeting object
      const meetingUuid = meeting.uuid;
      const meetingTopic = meeting.topic;
      const startTime = meeting.start_time;
      const downloadUrl = meeting.recording_files.filter(
        (file) => file.file_extension === "VTT"
      )[0]?.download_url;

      // Call formatData to format the date and time of the meeting
      const formattedDate = formatData(startTime);

      const blockArray = [
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${meetingTopic}*`,
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: `${formattedDate}`,
            emoji: true,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Analyze",
                emoji: true,
              },
              value: JSON.stringify({
                meetingUuid: meetingUuid,
                meetingTopic: meetingTopic,
                downloadUrl: downloadUrl,
              }),
              action_id: `open_modal-${meetingUuid}`,
            },
          ],
        },
      ];

      blockArray.forEach((block) => {
        blocks.push(block);
      });
    });
    console.log("blocks --- ", blocks);
    console.log("block 8 --- ", blocks[8]);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return {
    type: "home",
    callback_id: "home_view",
    blocks,
  };
};
