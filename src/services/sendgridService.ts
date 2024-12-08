const sgMail = require("@sendgrid/mail")
import { TmdbResponse } from "../config/tmdbConfig"

export async function sendSendgridEmail(formattedResponse: TmdbResponse) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const receiverEmails = (process.env.SENDGRID_RECEIVER_EMAIL || "")
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
          title: `${formattedResponse.title} (${formattedResponse.releaseDate.slice(0, 4)})`,
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
