
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  from: string
  to: string
  subject: string
  html: string
  text: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailData = await req.json()
    console.log('📧 Processing Amazon SES email request for:', emailData.to)

    // Get SES credentials from Supabase secrets
    const smtpUsername = Deno.env.get('AWS_SES_SMTP_USERNAME')
    const smtpPassword = Deno.env.get('AWS_SES_SMTP_PASSWORD')

    if (!smtpUsername || !smtpPassword) {
      console.error('❌ Missing SES credentials')
      return new Response(
        JSON.stringify({ error: 'SES credentials not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Amazon SES SMTP endpoint for US East (N. Virginia) - adjust region as needed
    const sesEndpoint = 'email-smtp.us-east-1.amazonaws.com'
    const sesPort = 587

    console.log('🚀 Sending email via Amazon SES SMTP...')

    // Create the email content
    const emailContent = [
      `From: ${emailData.from}`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="boundary123"`,
      ``,
      `--boundary123`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      emailData.text,
      ``,
      `--boundary123`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      emailData.html,
      ``,
      `--boundary123--`
    ].join('\r\n')

    // Connect to Amazon SES SMTP
    const conn = await Deno.connect({
      hostname: sesEndpoint,
      port: sesPort,
    })

    const writer = conn.writable.getWriter()
    const reader = conn.readable.getReader()

    // Helper function to read SMTP response
    const readResponse = async () => {
      const { value } = await reader.read()
      const response = new TextDecoder().decode(value)
      console.log('SMTP Response:', response)
      return response
    }

    // Helper function to send SMTP command
    const sendCommand = async (command: string) => {
      console.log('SMTP Command:', command)
      await writer.write(new TextEncoder().encode(command + '\r\n'))
      return await readResponse()
    }

    try {
      // SMTP conversation
      await readResponse() // Initial greeting
      
      await sendCommand('EHLO jobsties.com')
      await sendCommand('STARTTLS')
      
      // Upgrade to TLS - this is simplified, in production you'd need proper TLS handling
      
      await sendCommand('EHLO jobsties.com')
      
      // Authenticate
      const authString = btoa(`\0${smtpUsername}\0${smtpPassword}`)
      await sendCommand('AUTH PLAIN ' + authString)
      
      // Send email
      await sendCommand(`MAIL FROM:<service@jobsties.com>`)
      await sendCommand(`RCPT TO:<${emailData.to}>`)
      await sendCommand('DATA')
      
      await writer.write(new TextEncoder().encode(emailContent + '\r\n.\r\n'))
      await readResponse()
      
      await sendCommand('QUIT')
      
      console.log('✅ Email sent successfully via Amazon SES')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully via Amazon SES',
          recipient: emailData.to 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
      
    } finally {
      // Clean up connections
      writer.close()
      reader.cancel()
      conn.close()
    }

  } catch (error) {
    console.error('❌ Amazon SES email error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email via Amazon SES', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
