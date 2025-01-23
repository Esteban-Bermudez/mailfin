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
          backdropPath: formattedResponse.backdropPath,
          email: formattedResponse.emails,
          episodeCount: formattedResponse.episodeCount,
          episodeNumber: formattedResponse.episodeNumber,
          genres: formattedResponse.genres,
          homepage: formattedResponse.homepage,
          imdbUrl: formattedResponse.imdbUrl,
          itemType: formattedResponse.itemType,
          movieUrl: formattedResponse.movieUrl,
          name: formattedResponse.name,
          overview: formattedResponse.overview,
          posterPath: formattedResponse.posterPath,
          releaseDate: formattedResponse.releaseDate,
          releaseYear: formattedResponse.releaseYear,
          runtime: formattedResponse.runtime,
          seasonCount: formattedResponse.seasonCount,
          seasonEpisodeCount: formattedResponse.seasonEpisodeCount,
          seasonNumber: formattedResponse.seasonNumber,
          serverId: formattedResponse.serverId,
          serverName: formattedResponse.serverName,
          serverUrl: formattedResponse.serverUrl,
          seriesName: formattedResponse.seriesName,
          tagline: formattedResponse.tagline,
          tmdbId: formattedResponse.tmdbId,
          tmdbUrl: formattedResponse.tmdbUrl,
          tvUrl: formattedResponse.tvUrl,
        },
      },
    ],
    templateId: process.env.SENDGRID_TEMPLATE_ID,
  }
  await sgMail.send(msg)
}
