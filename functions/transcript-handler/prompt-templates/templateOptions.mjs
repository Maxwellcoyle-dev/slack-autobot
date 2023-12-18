import {
  connectOnboardingCall,
  connectKickoffCall,
  connectDiscoveryCall,
  learnOnboardingCall,
  generalMeeting,
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
  general_meeting: generalMeeting,
};
export const analysisTypeOptions = {
  docebo_call_followup_email: doceboCallFollowUpEmail,
  docebo_call_breakdown: doceboCallBreakdown,
  docebo_call_improvement_advice: doceboCallImprovementAdvice,
  summary_analysis: summaryAnalysis,
  call_notes: callNotes,
};
