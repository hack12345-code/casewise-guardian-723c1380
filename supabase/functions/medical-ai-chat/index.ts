
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

Images: Analyze medical images in detail - identify visible conditions, anomalies, or concerns. Provide professional medical interpretation and suggested follow-up actions.

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

    let messages = []
    
    if (imageData) {
      // If there's an image, format the message with both text and image
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "Please analyze this medical image in detail."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ]
    } else {
      // If there's no image, use text-only format
      messages = [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ]
    }

    console.log("Sending request to OpenAI with prompt and image:", !!imageData)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error("OpenAI API error:", data)
      throw new Error(data.error?.message || 'Failed to get AI response')
    }

    console.log("Received response from OpenAI")

    return new Response(
      JSON.stringify({ 
        response: data.choices[0].message.content,
        isImageAnalysis: !!imageData
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in medical-ai-chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred",
        isImageAnalysis: false
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
