import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    // Take the first few messages to understand the conversation context
    const conversationContext = messages
      .slice(0, 6) // First 6 messages should be enough for context
      .map(msg => `${msg.is_user ? 'User' : 'Pearson'}: ${msg.content}`)
      .join('\n')

    const prompt = `Based on this conversation between a student and Pearson AI tutor, generate a concise title that summarizes the main topic or subject being discussed. The title should be 1-7 words and capture the essence of what the student is learning about.

Conversation:
${conversationContext}

Requirements:
- 1-7 words maximum
- Focus on the academic subject or topic
- Be specific (e.g., "AP Biology Photosynthesis" not just "Biology")
- Use proper capitalization
- No quotes or special characters

Examples of good titles:
- "AP Chemistry Molecular Bonding"
- "Calculus Derivatives Practice"
- "World History Roman Empire"
- "Statistics Normal Distribution"
- "Computer Science Arrays"

Generate only the title, nothing else:`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating concise, descriptive titles for educational conversations. Generate only the title, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 50,
    })

    const title = completion.choices[0]?.message?.content?.trim() || "Study Session"
    
    // Ensure the title is within our length limits
    const finalTitle = title.length > 50 ? title.substring(0, 47) + "..." : title

    return NextResponse.json({ title: finalTitle })

  } catch (error) {
    console.error('Error generating chat title:', error)
    return NextResponse.json(
      { error: "Failed to generate chat title" },
      { status: 500 }
    )
  }
}
