import { generateHtmlTemplate } from "../templates/emailTemplate"
import { TmdbResponse } from "../config/tmdbConfig"

const nodeMailer = require("nodemailer")

export async function sendSMTPEmail(formattedResponse: TmdbResponse) {
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
      "A new movie has been added to Jellyfin " +
      formattedResponse.title +
      ` (${formattedResponse.releaseDate})`,
    html: generateHtmlTemplate(formattedResponse),
  }

  await transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error(error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}
