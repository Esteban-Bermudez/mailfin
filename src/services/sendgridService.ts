const sgMail = require("@sendgrid/mail")
import { MailfinResponse } from "../config/mailfinConfig"

export async function sendSendgridEmail(formattedResponse: MailfinResponse) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const receiverEmails = formattedResponse.emails
    .replace(/\s/g, "")
    .split(",")
    .map((email: string) => ({ email: email }))

  const msg = {
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
    },
    personalizations: [
      {
        to: receiverEmails, // array of objects with email key and value
        dynamic_template_data: {
          title: `${formattedResponse.name} (${formattedResponse.releaseYear})`,
          releaseDate: formattedResponse.releaseDate,
          overview: formattedResponse.overview,
          posterPath: formattedResponse.posterPath,
          movieUrl: formattedResponse.movieUrl,
          imdbUrl: formattedResponse.imdbUrl,
        },
      },
    ],
    templateId: process.env.SENDGRID_TEMPLATE_ID,
  }
  await sgMail.send(msg)
}
