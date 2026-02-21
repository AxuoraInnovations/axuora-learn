import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, count = 10, difficulty = 'medium' } = await req.json()
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `Generate ${count} high-quality flashcards for: ${topic}

Difficulty level: ${difficulty}

Return ONLY valid JSON array with this structure (no markdown, no extra text):
[
  {
    "front": "Clear, concise question or term",
    "back": "Complete answer or definition (2-3 sentences max)",
    "hint": "Optional hint to help recall"
  }
]

Make flashcards:
- Focused on exam-relevant content
- Progressive in difficulty
- Clear and unambiguous
- Suitable for spaced repetition learning`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 2048,
          }
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
    
    // Clean up markdown if present
    resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const flashcards = JSON.parse(resultText)
    
    if (!Array.isArray(flashcards)) {
      throw new Error('Invalid response format from AI')
    }
    
    return new Response(
      JSON.stringify({ flashcards, topic, count: flashcards.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Flashcard generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate flashcards' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
