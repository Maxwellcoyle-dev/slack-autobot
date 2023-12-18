export const doceboCallFollowUpEmail = `Review & Analyze the transcript in order to draft a follow up email for the Docebo client call. 

Subject: Docebo Connect Call [call #] Follow Up - [company name]

Hi [client name] Team,

[Start with a friendly intro, sumamrizing the email and thanking them for their time. Then, provide a summary of the call. Here is an example:]
Thanks for another productive call today. We made good progress towards setting up this [integration type] integration. Below is a link to the call recording as well as some notes from the call and action items for next week's call.

*Call Recording*
[recording link]

*Notes*
{notes based on the call]
Example notes
Successfully used get requests to retrieve worker profile information using both the Workday REST Connector & the Workday Web Services Connector
Successful test run on base recipe that gets all course completion data 

*Action Items*
{action items based on the call]
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

export const doceboCallBreakdown = `Review and analyze the Docebo client call. Generate a report with the following components:
Comprehensive list of action items for client
Comprehensive list of action items for consultant (SDM or TDM)
Comprehensive list of questions asked by the client team + a summary of the consultants answer 
Comprehensive list of questions asked by the consultant + a summary of the client teams answer
`;

export const doceboCallImprovementAdvice = `Please review and analyze the transcript in order to provide performance improvement advice to the consultant (SDM or TDM). The advice should focus on the following areas:
Call Management 
Project Management 
Communication
Clearity
This analysis will be used by the consultant to learn ways they can improve in the areas above. Do not be negative, instead find helpful advice to offer. Your advice should include practical steps or strategies that the consultant can easily implement. 
`;

export const summaryAnalysis = `Review and analyze this call. Provide a detailed summary of the call, including the following components: 
main topics
key decisions made
any questions asked along with the answer given
Action items + the person assigned to the task
Blockers or issues that remain unresolved
key takeaways 
`;

export const callNotes = `Review and analyze this call. Provide detailed bullet point notes for the call for the important topics discussed in the call. please go into as much detail as you can. These notes will be used to update team memebers on the call and ensure that everyone understands the content and meat of the call. Skip over any small talk and greetings.`;
