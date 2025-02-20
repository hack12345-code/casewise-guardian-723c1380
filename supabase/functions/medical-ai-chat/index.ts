
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageData } = await req.json();
    const messages = [];

    // Add the user's text prompt
    messages.push({
      role: 'system',
      content: 'You are a helpful medical assistant that can analyze both text and images to provide accurate medical insights.'
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
