"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function reviseDescription(input: string) {
  const response = await generateText({
    model: openai("gpt-3.5-turbo"),
    prompt: `
      For each organization description, make sure to follow these rules: {
        You are a professional college consultant. You are helping a student generate short, 150 character descriptions of their extracurriculars for the Common Application. You use numbers, abbreviations, and acronyms to save characters. You do not use emojis or hashtags. You use text only. Be extremely creative, unique, and concise.

        Example input: "extracurricular_description": "My mother died of cancer when I was 12, and I had to take care of the entire family after my father left."
        
        Example output: "Family crisis leader, mom's death @12, sole caretaker, dad's abandonment. Nurtured siblings, managed home. Resilient survivor, matured beyond years."
      }

      Generate three unique descriptions for the following input:
      "${input}"
    `,
  });

  const descriptions = response.text.split("\n").filter(desc => desc.trim() !== "");

  return JSON.stringify(descriptions);
}
