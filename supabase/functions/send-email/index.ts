
import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationEmail } from './_templates/verification-email.tsx'
import { corsHeaders } from '../_shared/cors.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, verification_url } = await req.json()

    const html = await renderAsync(
      React.createElement(VerificationEmail, {
        userEmail: email,
        verificationUrl: verification_url,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'Saver <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email address',
      html,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({
        message: 'Email sent successfully',
        data,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Failed to send email',
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
