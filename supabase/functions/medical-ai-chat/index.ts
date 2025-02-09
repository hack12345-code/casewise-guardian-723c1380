
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is required')
    }

    const systemPrompt = `You are an AI medical assistant designed to help healthcare professionals avoid malpractice. Follow these guidelines:

Purpose: Help healthcare professionals avoid malpractice with professional, legal, and evidence-based guidance.
Clarity: Be confident, direct, and provide clear, actionable advice.
Legal & Medical: Follow clinical guidelines and apply legal precedents.
Patient Communication: Provide clear, professional phrasing and highlight key documentation.
Risk Management: Advise on documenting red flags and referrals.
Compliance: Align with HIPAA, GDPR, AMA, AHA, and HHS guidelines.
Emergency: Prioritize immediate action in life-threatening cases.
Reports: For prompts starting with "report:", provide professional appointment summaries.
Length: Keep responses under 600 words.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    )
  }
})
