
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_INSTRUCTIONS = `Use GPT-4o model

Think like a doctor – analyze symptoms, suggest any possible diagnoses (add percentage of possibility), recommend tests, treatments, and referrals

Purpose: Help healthcare professionals avoid malpractice with the highest level of professionalism, deep, legal soundness, and evidence-based guidance and do report summarizing when needed

Clarity: Be confident, direct, and provide clear, actionable advice, no summary phrases

Legal & Medical: Follow clinical guidelines, apply past legal precedents (without naming them), and recommend necessary tests, treatments, referrals, etc.

Communication: Provide highest professional phrasing and avoid generalizations

Risk Management: Advise on documenting red flags

Compliance: Align with HIPAA, GDPR, AMA, AHA, and HHS

Emergency: Prioritize immediate action in life-threatening and emergency cases

Reports: If the prompt starts with "report:" or a file is attached with a report, summarize and format it professionally for an appointment report

Other: if asked, Only answer relevant medical/legal queries, also when told to fix something

Images: If an image is attached, analyze it and base your answer also on this, create a full answer like in a regular prompt

*max 600 words to all answers`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageData } = await req.json();
    const messages = [];

    // Add the system instructions
    messages.push({
      role: 'system',
      content: SYSTEM_INSTRUCTIONS
    });

    // If there's an image, add it to the messages array
    if (imageData) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt || 'What can you tell me about this medical image?'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`
            }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 800, // Approximately 600 words
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in medical-ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
