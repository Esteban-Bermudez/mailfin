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

  let subject = ''
  let html = generateHtmlTemplate(formattedResponse)
  if (formattedResponse.itemType === "Movie") {
    subject = `A new movie has been added to Jellyfin: ${formattedResponse.name} (${formattedResponse.releaseYear})`
  } else if (formattedResponse.itemType === "Season") {
    subject = `A new season has been added to Jellyfin: ${formattedResponse.name}`
  } else if (formattedResponse.itemType === "Episode") {
    subject = `A new episode has been added to Jellyfin: ${formattedResponse.name}`
  } else {
    subject = `A new item has been added to Jellyfin: ${formattedResponse.name}`
  }
    
  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: process.env.SMTP_RECEIVER_EMAIL,
    subject: subject,
    html: html,
  }

  await transporter.sendMail(mailOptions)
}
