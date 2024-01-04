// MEETING TYPE OPTIONS - Used to create the meeting type options
const meetingTypeOptions = [
  { id: "connect_onboarding_call", name: "Connect Onboarding Call" },
  { id: "connect_kickoff_call", name: "Connect Kickoff Call" },
  { id: "connect_discovery_call", name: "Connect Discovery Call" },
  { id: "learn_onboarding_call", name: "Learn Onboarding Call" },
  { id: "general_call", name: "General Call" },
];

// ANALYSIS TYPE OPTIONS - Used to create the analysis type options
const analysisTypeOptions = [
  { id: "docebo_call_followup_email", name: "Docebo Call Follow Up Email" },
  { id: "docebo_action_items", name: "Docebo Action Items + Questions" },
  {
    id: "docebo_call_improvement_advice",
    name: "Docebo Call Improvement Advice",
  },
  { id: "summary_analysis", name: "Summary Analysis" },
  { id: "call_notes", name: "Call Notes" },
  { id: "hive_health_report", name: "Hive Health Report" },
];

export const modalViewTemplate = (meetingUuid, meetingTopic, downloadUrl) => {
  console.log("modal view params --- ", meetingUuid, meetingTopic, downloadUrl);

  return {
    type: "modal",
    callback_id: `analysis_modal-${meetingUuid}`,
    title: {
      type: "plain_text",
      text:
        meetingTopic.length > 25
          ? `${meetingTopic.slice(0, 20)}...`
          : meetingTopic,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    blocks: [
      // Add your meetingTypeOptions and analysisTypeOptions here as static selects
      // ...
      {
        type: "input",
        block_id: "meeting_type_block",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select Meeting Type",
            emoji: true,
          },
          // Map meetingTypeOpions into the options array
          options: meetingTypeOptions.map((meetingType) => {
            return {
              text: {
                type: "plain_text",
                text: `${meetingType.name}`,
                emoji: true,
              },
              value: JSON.stringify({
                meetingUuid,
                meetingType: meetingType.id,
              }),
            };
          }),
          action_id: `meeting_type_action`,
        },
        label: {
          type: "plain_text",
          text: "Meeting Type",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "analysis_type_block",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select Analysis Type",
            emoji: true,
          },
          options: analysisTypeOptions.map((analysisType) => {
            return {
              text: {
                type: "plain_text",
                text: `${analysisType.name}`,
                emoji: true,
              },
              value: JSON.stringify({
                meetingUuid,
                analysisType: analysisType.id,
              }),
            };
          }),
          action_id: `analysis_type_action`,
        },
        label: {
          type: "plain_text",
          text: "Analysis Type",
          emoji: true,
        },
      },
    ],
    private_metadata: JSON.stringify({
      downloadUrl,
      meetingTopic,
      meetingUuid,
    }),
  };
};
