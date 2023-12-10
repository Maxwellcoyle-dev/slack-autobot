// MEETING TYPE OPTIONS - Used to create the meeting type options
const meetingTypeOptions = [
  "connect_onboarding_call",
  "connect_kickoff_call",
  "connect_discovery_call",
  "learn_onboarding_call",
  "learn_kickoff_call",
  "docebo_sho",
  "trainicity_team_meeting",
];

// ANALYSIS TYPE OPTIONS - Used to create the analysis type options
const analysisTypeOptions = [
  "docebo_call_followup_email",
  "docebo_call_breakdown",
  "docebo_call_improvement_advice",
  "detailed_meeting_notes",
  "summary_analysis",
];

export const modalViewTemplate = (meetingUuid, meetingTopic, downloadUrl) => {
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
                text: `${meetingType}`,
                emoji: true,
              },
              value: JSON.stringify({
                meetingUuid,
                meetingType,
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
                text: `${analysisType}`,
                emoji: true,
              },
              value: JSON.stringify({
                meetingUuid,
                analysisType,
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

// try {
//     // Make sure we have a meetingType and analysisType
//     if (
//       payload.view.state.values[blockId][meetingTypeActionId].selected_option
//         .value === null
//     ) {
//       console.log("meetingType or analysisType is null");
//       throw new Error("meetingType=null");
//     } else if (
//       payload.view.state.values[blockId][analysisTypeActionId].selected_option
//         .value === null
//     ) {
//       console.log("meetingType or analysisType is null");
//       throw new Error("analysisType=null");
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
