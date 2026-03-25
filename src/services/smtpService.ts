import { generateHtmlTemplate } from "../templates/emailTemplate"
import { MailfinResponse } from "../config/mailfinConfig"

const nodeMailer = require("nodemailer")

export async function sendSMTPEmail(formattedResponse: MailfinResponse) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_AUTH_USER ||
    !process.env.SMTP_AUTH_PASSWORD
  ) {
    console.error(
      "SMTP configuration is missing. Please check your environment variables.",
    )
    return
  }

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || "587",
    secure: false,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASSWORD,
    },
  })

  let subject = ""
  const html = generateHtmlTemplate(formattedResponse)
  if (formattedResponse.itemType === "Movie") {
    subject = `A new movie has been added to Jellyfin: ${formattedResponse.name} (${formattedResponse.releaseYear})`
  } else if (formattedResponse.itemType === "Season") {
    subject = `A new season has been added to Jellyfin: ${formattedResponse.name}`
  } else if (formattedResponse.itemType === "Episode") {
    subject = `A new episode has been added to Jellyfin: ${formattedResponse.name}`
  } else {
    subject = `A new item has been added to Jellyfin: ${formattedResponse.name}`
  }

  if (
    !process.env.SMTP_RECEIVER_EMAIL ||
    process.env.SMTP_RECEIVER_EMAIL.trim() === ""
  ) {
    console.error(
      "SMTP receiver email is not configured. Please set the SMTP_RECEIVER_EMAIL environment variable.",
    )
    return
  }

  const mailList = process.env.SMTP_RECEIVER_EMAIL?.split(",")
    .map((email) => email.trim())
    .filter((email) => email !== "")

  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: mailList,
    subject: subject,
    html: html,
  }

  await transporter.sendMail(mailOptions)
}
