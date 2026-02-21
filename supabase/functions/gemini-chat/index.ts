import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const { messages, feature = 'chat' } = await req.json()
    
    // System prompts based on feature
    const systemPrompts: Record<string, string> = {
      chat: "You are AxuoraLearn, an AI study assistant helping students prepare for exams. Be encouraging, clear, and thorough. Break down complex topics into digestible explanations.",
      flashcards: "Generate clear, concise flashcards. Front: question/term. Back: answer/definition with brief explanation.",
      analyzer: "You are analyzing a student's exam answer. Be constructive and specific.",
      gizmo: "You are in interactive teaching mode. Ask probing questions, give hints, and guide students to discover answers themselves.",
    }

    const systemMessage = systemPrompts[feature] || systemPrompts.chat
    
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemMessage }] },
            ...messages.map((m: any) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            }))
          ],
          generationConfig: {
            temperature: feature === 'gizmo' ? 0.8 : 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
    
    return new Response(
      JSON.stringify({ reply, feature }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Gemini chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
