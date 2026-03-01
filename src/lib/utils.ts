import { SupabaseClient } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MAX_FREE_TOKENS } from "./kolly_settings";
import { format } from "date-fns"

export function capitalizeFirstLetter(content: string) {
  return content.charAt(0).toUpperCase() + content.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkUserPlan(supabase: SupabaseClient) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data } = await supabase
      .from("users")
      .select("plan, tokens_used")
      .eq("uid", session.user.id)
      .single();

    if (data.plan !== "pro") {
      console.log("data", data.tokens_used);
      if (data.tokens_used >= MAX_FREE_TOKENS) {
        return false;
      }
    }
  }
  return true;
}

export function getFullUserContextPrompt(userInfo: any) {
  const userDataStr = JSON.stringify(userInfo, null, 2);
  return `Please do not use the userData if the userData is not relevant to the context of the users input. You should also never specifically mention the userData FORMATTING (YOU CAN USE THE DATA) in your response, only just reference it if it is relevant. \n\n User Data: 
${userDataStr.slice(0, 150)}
`;
}

export function finalChatbotInstructions() {
  return `Remember, you need to always follow the word limits. Also, when you are writing make sure that the writing is very clear! Tone: conversational, spartan, use less corporate jargon`;
}

export function promptIdeationChatbot(
  title: string,
  prompt: string,
  type: string
) {
  return `Prompt:
The idea: ${title}
The type of idea:${type}

I want you to basically guide me along the way of refining my idea for my college essay. The way that you are going to do this is to look at the chat history and basically determine what sort of questions I need to answer in order to get the best insights (the best grade, gradeDescription, vessel, lesson, additionalSuggestions). 

I want you to respond very concisely, focusing mainly on just the question and adding very little other than that. Do not provide anything other than questions like: How did you discover the lesson? What does it mean to you? Why does it matter? 

Please keep in mind that you are responding to this prompt if it is available: ${prompt}

Let's start with the first question that I will answer in the next message:
Firstly, can you give me a brief overview of the object, experience, or value? What does it mean to you? Why does it matter?
`;
}

export function promptIdeationChatbotInsights(messages: string) {
  return `Prompt:
${messages}

Please provide insights about the user's college essay idea in the following JSON format: 
{
  "grade": "<letter_grade>",
  "gradeDescription": "<brief_explanation_of_grade>",
  "vessel": "<vessel, e.g. how the user discovered the lesson and the object/experience/value that it is being told through>",
  "lesson": "<lesson, e.g. the central lesson or theme the user wants to convey through their essay, how they are a different person and what they learned>",
  "additionalSuggestions": "<specific_suggestions_or_questions>"
}

Here is the criteria to grade the user's essay idea:
Generated Insights
[Analyze the user's responses and provide a brief summary of the key insights gained from the conversation. If the user has not provided enough information to generate meaningful insights, use the following message:]
Not so fast...
Before we can generate insights, we need you to answer at least [number] more questions.
Grade
[Assign a grade to the user's college essay idea based on its potential, originality, and the user's ability to convey the central lesson effectively. Provide a brief explanation for the grade.]
Additional Suggestions
[Provide specific suggestions or questions to help the user further refine their college essay idea, based on the insights gained from the conversation. Encourage the user to continue exploring their idea and provide additional details or examples as needed.]

RETURN NOTHING BUT THE JSON. .
`;
}

export async function handleTokens(
  userId: string,
  usage: any,
  userInfo: any,
  supabase: SupabaseClient
) {
  const tokensUsed = usage?.totalTokens;
  const tokens = userInfo[0].tokens_used;
  const gptVersion = userInfo[0].Gpt_version;
  
  const updateData: any = {
    tokens_used: tokens + tokensUsed,
  };

  if (gptVersion?.includes('4')) {
    updateData.Gpt_4_tokens_used = (userInfo[0].Gpt_4_tokens_used || 0) + tokensUsed;
  } else {
    updateData.Gpt_3_tokens_used = (userInfo[0].Gpt_3_tokens_used || 0) + tokensUsed;
  }

  await supabase
    .from("users")
    .update(updateData)
    .eq("uid", userId);
}
