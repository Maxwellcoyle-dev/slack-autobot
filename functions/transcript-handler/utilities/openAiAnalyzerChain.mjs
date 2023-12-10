import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

import { getSecret } from "/opt/nodejs/utilities/getSecret.mjs";

import { analyzeTranscriptPromptTemplate } from "../prompt-templates/analyzeTranscriptPromptTemplate.mjs";
import {
  meetingTypeOptions,
  analysisTypeOptions,
} from "../prompt-templates/templateOptions.mjs";

const openaiSecretname = "dev/meeting-analyzer/openai-key";

export const openAiAnalyzerChain = async (
  transcript,
  meetingType,
  analysisType,
  meetingTopic
) => {
  try {
    const openaiApiKeyResponse = await getSecret(openaiSecretname);
    const openAIApiKey = openaiApiKeyResponse.OPENAI_API_KEY;

    const llmOpenAI = new OpenAI({
      openAIApiKey: openAIApiKey,
      modelName: "gpt-4-1106-preview",
      temperature: 0,
    });

    let meetingTypePromptContext;
    let analysisPromptContext;

    const constructPrompt = (payloadMeetingType, payloadAnalysisType) => {
      meetingTypePromptContext = meetingTypeOptions[payloadMeetingType];
      analysisPromptContext = analysisTypeOptions[payloadAnalysisType];

      console.log("meetingAnalysisPrompt", meetingTypePromptContext);
      console.log("analysisPromptContext", analysisPromptContext);
    };

    constructPrompt(meetingType, analysisType);

    const prompt = new PromptTemplate({
      template: analyzeTranscriptPromptTemplate,
      inputVariables: [
        "transcript",
        "meetingTopic",
        "meetingType",
        "analysisType",
      ],
    });

    const llmChain = new LLMChain({
      llm: llmOpenAI,
      prompt: prompt,
    });

    const result = await llmChain.call({
      transcript: transcript,
      meetingTopic: meetingTopic,
      meetingType: meetingTypePromptContext,
      analysisType: analysisPromptContext,
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error in the openAiAnalyzerChain --- ", error);
  }
};
