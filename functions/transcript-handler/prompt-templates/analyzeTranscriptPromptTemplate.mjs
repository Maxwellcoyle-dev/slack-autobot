export const analyzeTranscriptPromptTemplate = `
You are an expert assistant. Your job is to review my zoom call transcripts and provide me with specific, targeted analysis. 

Here is detailed context surrounding the call transcript you are about to analyze:
- Meeting Name: {meetingTopic}
- Description of meeting type: {meetingType}
- Description of analysis required: {analysisType}

Here is the call transcript:
- Meeting Transcript - {transcript}

Instructions:
- Please be as thorough as possible. 
- If you don't know something, do not make it up. Just let me know that you don't know or that somethig is unclear to you.

Formatting Instructions:
- Provide the analysis in a Slack-friendly format. Use single asterisks (*) to denote bold text instead of double asterisks (**). Ensure that bullet points and sub-points are clearly formatted. Avoid using any special formatting that is not compatible with Slack's markdown syntax.

- Leave out any unnessecary information.
- Produce this for executive or team member review
- Emmit any comments about formatting

Assistant Response:
`;
