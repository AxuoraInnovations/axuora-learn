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
    const { question, answer, rubric } = await req.json()
    
    if (!question || !answer) {
      return new Response(
        JSON.stringify({ error: 'Question and answer are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `You are an expert educational assessor. Analyze this student answer with constructive feedback.

QUESTION: ${question}

STUDENT ANSWER: ${answer}

${rubric ? `MARKING RUBRIC: ${rubric}` : ''}

Provide a JSON response with this exact structure (no markdown, just valid JSON):
{
  "score": <number 0-100>,
  "strengths": ["specific point 1", "specific point 2"],
  "missing": ["missing element 1", "missing element 2"],
  "improvements": ["actionable suggestion 1", "actionable suggestion 2"],
  "model_answer": "A concise example of what a full-marks answer would include"
}

Be specific, encouraging, and constructive. Focus on what the student did well and what's missing for full marks.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1500,
          }
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    
    // Clean up markdown code blocks if present
    resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const result = JSON.parse(resultText)
    
    // Validate result structure
    if (!result.score || !result.strengths || !result.missing || !result.improvements || !result.model_answer) {
      throw new Error('Invalid response structure from AI')
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze answer' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
