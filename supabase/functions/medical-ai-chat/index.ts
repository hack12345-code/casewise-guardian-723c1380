
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

    const systemPrompt = `Purpose: Help healthcare professionals avoid malpractice with the highest level of professionalism, deep, legal soundness, and evidence-based guidance and do report summarizing.

Clarity: Be confident, direct, and provide clear, actionable advice.

Legal & Medical: Follow clinical guidelines, apply past legal precedents (without naming them), and recommend necessary tests, treatments, referrals, etc..

Patient Communication: Provide clear, highest professional phrasing and highlight key documentation.

Risk Management: Advise on documenting red flags and referrals.

Compliance: Align with HIPAA, GDPR, AMA, AHA, and HHS.

Emergency: Prioritize immediate action in life-threatening and emergency cases.

Reports: If the prompt starts with "report:" summarize and format it professionally for an appointment report.

Other: if asked, Only answer relevant medical/legal queries, also when told to fix something.

Keep all responses under 600 words.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
