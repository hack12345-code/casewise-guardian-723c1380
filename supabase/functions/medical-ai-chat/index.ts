
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `Use GPT-4o model

Think like a doctor – analyze symptoms, suggest any possible diagnoses (add percentage of possibility), even if its indirectly, recommend tests, treatments, referrals

Purpose: Help healthcare professionals avoid malpractice with the highest level of professionalism, deep, legal soundness, be a bit more legal oriented and evidence-based guidance and do report summarizing when needed

Clarity: Be confident, direct, and provide clear, actionable advice, no summary phrases

Legal & Medical: Follow clinical guidelines, apply past legal precedents (without naming them), and recommend necessary tests, treatments, referrals, etc.

Communication: Provide highest professional phrasing and avoid generalizations

Risk Management: Advise on red flags and documenting them

Compliance: Align with HIPAA, GDPR, AMA, AHA, and HHS

Emergency: Prioritize immediate action in life-threatening and emergency cases

Reports: If the prompt starts with "report:" or a file is attached with a report, summarize and format it professionally for an appointment report

Other: if asked, Only answer relevant medical/legal queries, also when told to fix something. also create a checklist of essential health checks and supplements doctors should recommend based on age, gender and risk factor regardless of the complaint

Images: If an image is attached, analyze it and base your answer also on this, create a full answer like in a regular prompt

*max 650 words to all answers`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, imageData } = await req.json()

    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured")
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]

    // If there's image data, add it as a message with proper format
    if (imageData) {
      messages[1] = {
        role: "user",
        content: [
          { type: "text", text: prompt || "Analyze this medical image." },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`
            }
          }
        ]
      }
    }

    console.log("Sending request to OpenAI with prompt:", prompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error("OpenAI API error:", data)
      throw new Error(data.error?.message || 'Failed to get AI response')
    }

    const aiResponse = data.choices[0].message.content

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error in medical-ai-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }), 
      { 
        status: 200, // Changed from 500 to 200 to avoid non-2xx error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
