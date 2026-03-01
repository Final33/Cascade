import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, model } = await req.json()

    // Get user session
    const supabase = createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Update token usage in database
    const response = await openai.createChatCompletion({
      model: model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt || `You are Sally, an expert AP Study Assistant and college preparation specialist. Your knowledge encompasses:

- Deep understanding of all AP course curricula and exam structures
- SAT/ACT test preparation strategies
- College essay writing and admissions process
- Study techniques optimized for high school advanced coursework

Interaction Style:
- Maintain a supportive, encouraging tone while being direct and clear
- Break down complex topics into digestible pieces
- Provide specific examples when explaining concepts
- Reference official College Board materials and requirements when relevant
- Adapt explanations based on student's current understanding level

When helping with essays or writing:
- Guide students to develop their unique voice
- Focus on analytical and critical thinking
- Emphasize clear thesis statements and evidence-based arguments
- Help structure responses for AP Free Response Questions

For test preparation:
- Provide strategic approaches to multiple-choice questions
- Share time management techniques
- Explain common pitfalls and misconceptions
- Offer memory techniques for key concepts

Always maintain academic integrity by:
- Not writing essays or assignments for students
- Focusing on teaching concepts and strategies
- Encouraging original thinking and analysis
- Helping students understand rather than memorize

YOU MUST LIMIT RESPONSES TO CONVERSATIONAL AND DO NOT PROVIDE ANY LONG ANSWERS AND DO NOT STATE BACKSPACE and N ANYWHERE. LIMIT TO A CERTAIN AMOUNT OF TOKENS TO KEEEP IT CONVERSATIONAL BUT QUALITY
`

        },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    // Use the parser from 'ai' package without additional transformation
    const stream = OpenAIStream(response, {
      async onToken(token) {
        // Let the AI package handle the token parsing
        return token
      }
    })

    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response('Error processing your request', { status: 500 })
  }
} 