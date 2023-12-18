import {
  connectOnboardingCall,
  connectKickoffCall,
  connectDiscoveryCall,
  learnOnboardingCall,
  trainicityTeamMeeting,
} from "./meetingTypes.mjs";

import {
  doceboCallFollowUpEmail,
  doceboCallBreakdown,
  doceboCallImprovementAdvice,
  summaryAnalysis,
  callNotes,
} from "./analysisTypes.mjs";

// MEETING TYPE OPTIONS - Used to create the meeting type options
export const meetingTypeOptions = {
  connect_onboarding_call: connectOnboardingCall,
  connect_kickoff_call: connectKickoffCall,
  connect_discovery_call: connectDiscoveryCall,
  learn_onboarding_call: learnOnboardingCall,
  trainicity_team_meeting: trainicityTeamMeeting,
};
export const analysisTypeOptions = {
  docebo_call_followup_email: doceboCallFollowUpEmail,
  docebo_call_breakdown: doceboCallBreakdown,
  docebo_call_improvement_advice: doceboCallImprovementAdvice,
  summary_analysis: summaryAnalysis,
  call_notes: callNotes,
};
