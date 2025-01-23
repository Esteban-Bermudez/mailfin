import { generateHtmlTemplate } from "../templates/emailTemplate"
import { MailfinResponse } from "../config/mailfinConfig"

const nodeMailer = require("nodemailer")

export async function sendSMTPEmail(formattedResponse: MailfinResponse) {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || "587",
    secure: false,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: process.env.SMTP_RECEIVER_EMAIL,
    subject:
      ` A new ${formattedResponse.itemType} has been added to Jellyfin ` +
      formattedResponse.name +
      ` (${formattedResponse.releaseYear})`,
    html: generateHtmlTemplate(formattedResponse),
  }

  await transporter.sendMail(mailOptions)
}
