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
          ? `${meetingTopic.slice(0, 22)}...`
          : meetingTopic,
    },
    blocks: [
      // Add your meetingTypeOptions and analysisTypeOptions here as static selects
      // ...
      {
        type: "actions",
        elements: [
          {
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
            action_id: `select_meeting_type-${meetingUuid}`,
          },
          {
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
            action_id: `select_analysis_type-${meetingUuid}`,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Submit",
              emoji: true,
            },
            value: JSON.stringify({ meetingUuid, meetingTopic, downloadUrl }),
            action_id: "submit_analysis",
          },
        ],
      },
    ],
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
