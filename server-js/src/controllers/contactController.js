
import nodemailer from "nodemailer";
import path from "path";

// Configure Nodemailer transporter
// Using environment variables for secure credential management
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASS, // Your App Password
  },
});

export const submitContactForm = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    // Basic Validation
    if (!email || !subject) {
      return res.status(400).json({
        success: false,
        message: "Email and Subject are required.",
      });
    }

    // HTML Template for Admin Notification
    const adminMailOptions = {
      from: `"DevMorph Contact" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // Admin email address
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #84cc16; padding-bottom: 10px;">New Inquiry Received</h2>
          <p style="font-size: 16px; color: #555;"><strong>From:</strong> ${email}</p>
          <p style="font-size: 16px; color: #555;"><strong>Subject:</strong> ${subject}</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-top: 20px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">${message || "No message body provided."}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">Sent from DevMorph Contact Form</p>
        </div>
      `,
    };

    // HTML Template for User Confirmation
    const userMailOptions = {
      from: `"DevMorph Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                
                <!-- Main Container -->
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111111; border-radius: 16px; overflow: hidden; border: 1px solid #333333; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                  
                  <!-- Header / Logo -->
                  <tr>
  <td align="center" style="padding: 40px 0 20px 0; background-color: #111111;">
    <img 
      src="cid:logo" 
      alt="DevMorph" 
      width="50" 
      height="50"
      style="display: block; width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" 
    />
  </td>
</tr>


                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center;">
                      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Message Received</h1>
                      
                      <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Hello there,
                      </p>
                      
                      <p style="color: #e4e4e7; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Thank you for reaching out to us. We have received your inquiry regarding <strong style="color: #a3e635;">"${subject}"</strong>.
                      </p>

                      <div style="background-color: #1c1c1c; border-radius: 12px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #a3e635; text-align: left;">
                         <p style="color: #d4d4d8; font-size: 14px; margin: 0; line-height: 1.5; font-style: italic;">
                           "Our team is already reviewing your request and will get back to you shortly. We appreciate your patience."
                         </p>
                      </div>

                      <a href="https://devmorph.vercel.app" style="display: inline-block; background-color: #a3e635; color: #000000; font-weight: bold; text-decoration: none; padding: 12px 32px; border-radius: 50px; font-size: 16px; transition: opacity 0.3s ease;">
                        Visit Website
                      </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1c1c1c; padding: 30px 40px; text-align: center; border-top: 1px solid #333333;">
                      <p style="color: #71717a; font-size: 12px; margin: 0 0 10px 0;">
                        &copy; ${new Date().getFullYear()} DevMorph. All rights reserved.
                      </p>
                      <p style="color: #71717a; font-size: 12px; margin: 0;">
                        You received this email because you contacted us via our website.
                      </p>
                    </td>
                  </tr>

                </table>
                <!-- End Main Container -->

              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(process.cwd(), './src/public/logo.png'),
          cid: 'logo'
        }
      ]
    };

    // Send emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};
