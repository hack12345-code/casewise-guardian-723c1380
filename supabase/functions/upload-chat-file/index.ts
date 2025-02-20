
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const chatId = formData.get('chatId')
    const userId = formData.get('userId')

    if (!file || !chatId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sanitize filename and generate unique path
    const fileName = (file as File).name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = fileName.split('.').pop()
    const filePath = `${chatId}/${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat_files')
      .upload(filePath, file, {
        contentType: (file as File).type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Store file metadata in database
    const { error: dbError } = await supabase
      .from('chat_files')
      .insert({
        chat_id: chatId,
        user_id: userId,
        file_name: fileName,
        file_path: filePath,
        content_type: (file as File).type,
        size: (file as File).size
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save file metadata' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('chat_files')
      .getPublicUrl(filePath)

    return new Response(
      JSON.stringify({
        message: 'File uploaded successfully',
        filePath,
        publicUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
