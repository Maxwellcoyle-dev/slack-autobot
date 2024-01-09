export const doceboCallFollowUpEmail = `
Docebo Call Follow Up Email:
Review & Analyze the transcript in order to draft a follow up email for the Docebo client call. 

Subject: Docebo Connect Call [call #] Follow Up - [company name]

Hi [client name] Team,

[Start with a friendly intro, sumamrizing the email and thanking them for their time. Then, provide a summary of the call. Here is an example:]
Thanks for another productive call today. We made good progress towards setting up this [integration type] integration. Below is a link to the call recording as well as some notes from the call and action items for next week's call.

Call Recording
[recording link]

Notes
{notes based on the call]
Example notes
Successfully used get requests to retrieve worker profile information using both the Workday REST Connector & the Workday Web Services Connector
Successful test run on base recipe that gets all course completion data 

Action Items
[action items based on the call]
Example action items
Determine request to update users in Workday
Workday REST Connector using a Custom Action
Workday Connector using the create/update action
Test the update user endpoint
Test our ability to update a user custom object with demo data
Add Workday operations to the base recipe 
Get the user who completed a course
update the users profile in workday with new course completion data

Thanks again for your time this week. If any questions come up over the next week please don't hesitate to reach out.

Best,
Max


This email should have a professional & friendly tone. It should be clear, concise and direct. 
`;

export const doceboCallBreakdown = `
Docebo Call Breakdown:
- Review and analyze the Docebo client call. Generate a report with the following components:
- Comprehensive list of action items for client
- Comprehensive list of action items for consultant (SDM or TDM)
- Comprehensive list of questions asked by the client team + a summary of the consultants answer 
- Comprehensive list of questions asked by the consultant + a summary of the client teams answer
`;

export const doceboCallImprovementAdvice = `
Docebo Call Improvement Advice:
Please review and analyze the transcript in order to provide performance improvement advice to the consultant (SDM or TDM). The advice should focus on the following areas:
- Call Management 
- Project Management 
- Communication
- Clearity

This analysis will be used by the consultant to learn ways they can improve in the areas above. Do not be negative, instead find helpful advice to offer. Your advice should include practical steps or strategies that the consultant can easily implement. 
`;

export const summaryAnalysis = `
Summary Analysis:
Review and analyze this call. Provide a detailed summary of the call, including the following components: 
- List of topics covered
- List of decisions made
- List of questions asked along with the answer given
- List of action items + the person assigned to the task
- List of blockers or issues that remain unresolved
`;

export const callNotes = `
Call Notes: 
Review and analyze this call. Provide detailed notes for the call. Please go into as much detail as you can. These notes will be used to update team memebers on the call and ensure that everyone understands the content and meat of the call. Skip over any small talk and greetings.`;

export const hiveHealthReport = `
Hive Health Report:
For each week of a Docebo onboarding project, we need to write a brief health report that is posted in our project management tool. The health report is 2-5 sentences and its main goal is to provide a brief positive overview of the current progress and status of the project.The report should contain milestones achieved in this week's call, next steps that need to be completed in the coming weeks, and any roadblocks that might be present. Only mention roadblocks that are significant.

Here are examples of health reports:

“Today we completed the configuration and added the session link to the calendar event. We ran multiple successful tests. The team is going to continue testing this week and we'll discuss progress during our next call. Next call will be our 6th call. So I am planning to transition to this project in 3 weeks.”

“Integration configuration completed and now running various tests to ensure that everything is working and flowing as expected. Just finished my 6th call this week. Should be transitioning in 2 weeks. on the 17th.”

“We have set up a recipe in Docebo that gets the required course completion data. We have also set up a connection with the Workday client and ran some successful get requests. Now the team is troubleshooting the update / create call that comes with the workday REST Connection.”

Review and analyze this call transcript and provide a brief health report as described above. Ensure that the analysis is positive, professional and very concise.`;
