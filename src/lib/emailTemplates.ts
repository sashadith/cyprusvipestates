// app/lib/emailTemplates.ts (пример)
export function getAutoReplyHtml(name?: string) {
  const safeName = name?.trim() || "Dear Client";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Thank you for your enquiry</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.08);">
          
          <!-- HEADER / LOGO -->
          <tr>
            <td align="center" style="padding:24px 24px 8px 24px;">
              <img src="https://cdn.sanity.io/images/88gk88s2/production/c4911e6ba6654becbeda47f9485754fbcfeb407e-500x634.png" 
                  alt="Cyprus VIP Estates" 
                  width="80"
                  style="display:block; height:auto;" />
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td align="center" style="padding:8px 24px 0 24px;">
              <h1 style="margin:0; font-size:22px; line-height:1.4; font-weight:400; color:#111111;">
                Thank you for your enquiry
              </h1>
            </td>
          </tr>

          <!-- HELLO + INTRO -->
          <tr>
            <td align="left" style="padding:16px 32px 0 32px; color:#333333; font-size:14px; line-height:1.7;">
              <p style="margin:0 0 12px 0;">${safeName},</p>
              <p style="margin:0 0 12px 0;">
                Thank you for contacting <strong>Cyprus VIP Estates</strong>.
                We’ve received your enquiry and our team will get back to you shortly with
                personalised property options and answers to your questions.
              </p>
            </td>
          </tr>

          <!-- WHAT HAPPENS NEXT -->
          <tr>
            <td align="left" style="padding:8px 32px 0 32px; color:#333333; font-size:14px; line-height:1.7;">
              <p style="margin:0 0 8px 0;"><strong>What happens next?</strong></p>
              <ul style="margin:0 0 12px 20px; padding:0; color:#333333; font-size:14px; line-height:1.7;">
                <li>We will review your enquiry and property preferences.</li>
                <li>One of our consultants will contact you via your preferred channel.</li>
                <li>We’ll prepare tailored property offers directly from verified developers in Cyprus.</li>
              </ul>
              <p style="margin:0 0 12px 0;">
                If you’d like to speed up the process, you can already explore our latest projects below.
              </p>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td align="center" style="padding:8px 32px 24px 32px;">
              <a href="https://cyprusvipestates.com/projects"
                target="_blank"
                style="
                  display:inline-block;
                  padding:12px 28px;
                  background-color:#bd8948;
                  color:#ffffff;
                  text-decoration:none;
                  font-size:14px;
                  border-radius:4px;
                  font-weight:400;
                ">
                Browse properties in Cyprus
              </a>
            </td>
          </tr>

          <!-- CONTACT BLOCK -->
          <tr>
            <td align="left" style="padding:0 32px 16px 32px; color:#333333; font-size:13px; line-height:1.6; border-top:1px solid #eeeeee;">
              <p style="margin:16px 0 4px 0;"><strong>Cyprus VIP Estates</strong></p>
              <p style="margin:0;">
                Phone / WhatsApp: <a href="tel:+35799278285" style="color:#bd8948; text-decoration:none;">+357 99 278 285</a><br />
                WhatsApp: <a href="https://wa.me/35799278285" style="color:#bd8948; text-decoration:none;">Chat on WhatsApp</a><br />
                Email: <a href="mailto:office@cyprusvipestates.com" style="color:#bd8948; text-decoration:none;">office@cyprusvipestates.com</a><br />
                Website: <a href="https://cyprusvipestates.com" style="color:#bd8948; text-decoration:none;">cyprusvipestates.com</a>
              </p>
            </td>
          </tr>

          <!-- SOCIAL LINKS -->
          <tr>
            <td align="center" style="padding:0 32px 24px 32px; color:#777777; font-size:12px; line-height:1.6;">
              <p style="margin:0 0 6px 0;">Follow us:</p>
              <p style="margin:0;">
                <a href="https://www.instagram.com/cyprusvipestates/" style="color:#bd8948; text-decoration:none;">Instagram</a> ·
                <a href="https://www.youtube.com/@cyprusvipestates" style="color:#bd8948; text-decoration:none;">YouTube</a> ·
                <a href="https://www.facebook.com/cyprusvipestates" style="color:#bd8948; text-decoration:none;">Facebook</a> ·
                <a href="https://www.tiktok.com/@cyprusvipestates" style="color:#bd8948; text-decoration:none;">TikTok</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER SMALL -->
          <tr>
            <td align="center" style="padding:0 24px 16px 24px; color:#aaaaaa; font-size:11px; line-height:1.5;">
              <p style="margin:0;">
                You received this email because you submitted an enquiry on the Cyprus VIP Estates website.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
