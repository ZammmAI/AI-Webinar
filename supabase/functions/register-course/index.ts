import { Resend } from "npm:resend"
import { JWT } from "npm:google-auth-library"
import serviceAccount from "./service-account.json" with { type: "json" };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const GOOGLE_SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID')

    if (!RESEND_API_KEY) console.error("Missing RESEND_API_KEY");
    if (!GOOGLE_SHEET_ID) console.error("Missing GOOGLE_SHEET_ID");

    console.log("Processing registration...");

    const data = await req.json()
    const { fullName, email, phone, age, nic, gender, courseTitle, coursePrice, receiptUrl } = data

    // 1. Send Email via Resend
    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)
        
        // Student Email Template
        const studentEmailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 40px; border-radius: 24px; color: #f8fafc;">
            <h1 style="color: #10b981; font-size: 32px; margin-bottom: 20px;">Registration Received!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">Hi ${fullName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">Thank you for enrolling in <strong>${courseTitle}</strong>. We have received your payment receipt and details.</p>
            <div style="background: #1e293b; padding: 24px; border-radius: 16px; margin: 30px 0; border: 1px solid #334155;">
              <p style="margin: 0; color: #10b981; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">Registration Summary</p>
              <h2 style="margin: 10px 0; font-size: 20px; color: #fff;">${courseTitle}</h2>
              
              <div style="margin-top: 16px; border-top: 1px solid #334155; padding-top: 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8; width: 40%;"><strong>Student Name:</strong></td>
                    <td style="padding: 4px 0; color: #fff;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8;"><strong>Amount:</strong></td>
                    <td style="padding: 4px 0; color: #fff;">${coursePrice || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8;"><strong>Status:</strong></td>
                    <td style="padding: 4px 0; color: #fbbf24;">Verification Pending</td>
                  </tr>
                </table>
              </div>
            </div>
            <p style="font-size: 14px; color: #64748b;">Our team will verify your payment and reach to you through WhatsApp once verified.</p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 30px 0;" />
            <p style="font-size: 12px; color: #475569; text-align: center;">&copy; 2026 Academy of Billionaires. All rights reserved.</p>
          </div>
        `

        // Admin Email Template
        const adminEmailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>New Course Registration Alert</h2>
            <p><strong>Course:</strong> ${courseTitle}</p>
            <ul>
              <li><strong>Name:</strong> ${fullName}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Age:</strong> ${age}</li>
              <li><strong>NIC:</strong> ${nic}</li>
              <li><strong>Gender:</strong> ${gender}</li>
            </ul>
            <p><strong>Receipt:</strong> <a href="${receiptUrl}">View Receipt</a></p>
          </div>
        `

        // Send to Student
        const studentEmailResult = await resend.emails.send({
          from: 'AOB Academy <info@mail.theaob.lk>',
          to: [email],
          subject: `Registration Received: ${courseTitle}`,
          html: studentEmailHtml,
        })
        console.log("Student email sent successfully:", studentEmailResult);

        // Send to Admin
        const adminEmailResult = await resend.emails.send({
          from: 'AOB Academy <info@mail.theaob.lk>',
          to: ['academyofbillionaires@gmail.com'], // Admin email address
          subject: `New Registration: ${fullName} - ${courseTitle}`,
          html: adminEmailHtml,
        })
        console.log("Admin email sent successfully:", adminEmailResult);

      } catch (emailErr) {
        console.error("Email failed:", emailErr);
      }
    }

    // 2. Sync to Google Sheets
    if (GOOGLE_SHEET_ID) {
      try {
        const client = new JWT({
          email: serviceAccount.client_email,
          key: serviceAccount.private_key,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const token = await client.authorize();

        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/A1:append?valueInputOption=USER_ENTERED`;
        const response = await fetch(sheetsUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.access_token}`,
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
          console.error("Google Sheets API error:", response.status, errText);
        }
      } catch (sheetsError) {
        console.error("Google Sheets integration error:", sheetsError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("Function error:", error)
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
