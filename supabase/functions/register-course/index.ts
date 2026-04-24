import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend"
import { JWT } from "npm:google-auth-library"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const GOOGLE_SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID')

    console.log("Processing registration...");

    const data = await req.json()
    const { fullName, email, phone, age, nic, gender, courseTitle, receiptUrl } = data

    // 1. Send Email via verified domain
    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)
        const emailHtml = [
          '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 40px; border-radius: 24px; color: #f8fafc;">',
          '<h1 style="color: #10b981; font-size: 32px; margin-bottom: 20px;">Registration Received!</h1>',
          '<p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">Hi ' + fullName + ',</p>',
          '<p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">Thank you for enrolling in <strong>' + courseTitle + '</strong>. We have received your payment receipt and details.</p>',
          '<div style="background: #1e293b; padding: 24px; border-radius: 16px; margin: 30px 0; border: 1px solid #334155;">',
          '<p style="margin: 0; color: #10b981; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">Course Details</p>',
          '<h2 style="margin: 10px 0; font-size: 20px; color: #fff;">' + courseTitle + '</h2>',
          '<p style="margin: 0; color: #94a3b8;">Status: Verification Pending</p>',
          '</div>',
          '<p style="font-size: 14px; color: #64748b;">Our team will verify your payment and NIC details. You will receive the Zoom links and course materials via email and WhatsApp once verified.</p>',
          '<hr style="border: 0; border-top: 1px solid #334155; margin: 30px 0;" />',
          '<p style="font-size: 12px; color: #475569; text-align: center;">&copy; 2026 Academy of Billionaires. All rights reserved.</p>',
          '</div>',
        ].join('\n')

        const emailResult = await resend.emails.send({
          from: 'AOB Academy <info@mail.theaob.lk>',
          to: [email],
          subject: 'Registration Received: ' + courseTitle,
          html: emailHtml,
        })
        console.log("Email sent successfully:", emailResult);
      } catch (emailErr) {
        console.error("Email failed:", emailErr);
      }
    }

    // 2. Sync to Google Sheets
    if (GOOGLE_SHEET_ID) {
      try {
        const fileContent = await Deno.readTextFile(new URL("./service-account.json", import.meta.url));
        const serviceAccount = JSON.parse(fileContent);

        const client = new JWT({
          email: serviceAccount.client_email,
          key: serviceAccount.private_key,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const token = await client.authorize();

        const sheetsUrl = 'https://sheets.googleapis.com/v4/spreadsheets/' + GOOGLE_SHEET_ID + '/values/A1:append?valueInputOption=USER_ENTERED';
        const response = await fetch(sheetsUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[
              fullName, email, age, phone, nic, gender, courseTitle, receiptUrl, new Date().toISOString()
            ]]
          })
        });

        if (response.ok) {
          console.log("Google Sheets sync successful");
        } else {
          const errText = await response.text();
          console.error("Google Sheets API error:", errText);
        }
      } catch (sheetsError) {
        console.error("Google Sheets integration error:", sheetsError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Function error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
