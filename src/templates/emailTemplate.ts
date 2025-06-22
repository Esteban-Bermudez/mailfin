import { MailfinResponse } from "../config/mailfinConfig"
export function generateHtmlTemplate(data: MailfinResponse) {
  let title = `${data.name} (${data.releaseYear})`
  let subtitle = data.tagline
  if (data.itemType == "Episode") {
    title = `${data.seriesName} - S${data.seasonNumber}E${data.episodeNumber} - ${data.name}`
  } else if (data.itemType == "Season") {
    title = `${data.seriesName} - S${data.seasonNumber}`
  }

  return `
<html>
<head>
  <style>
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
    }

    /* General styles */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      border-collapse: collapse;
    }
    .button {
      display: inline-block;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 2px;
      line-height: normal;
      padding: 12px 18px;
      text-align: center;
      text-decoration: none;
      border-radius: 6px;
      border-style: solid;
      border-width: 1px;
    }
    .button-jellyfin {
      background-color: #7d76ca;
      border-color: #333333;
      color: #ffffff !important;
    }
    .button-tmdb {
      background-color: #007ca6;
      border-color: #333333;
      color: #ffffff !important;
    }
    .button-imdb {
      background-color: #fec83b;
      border-color: #333333;
      color: #000000 !important;
    }
    .poster-img {
      width: 100%;
      max-width: 300px;
      height: auto;
      border-radius: 10px;
    }
    .backdrop-img {
      width: 100%;
      max-width: 500px; /* Adjusted for smaller size */
      height: auto !important;
      border-radius: 10px;
      display: block; /* Ensure it behaves like a block element */
      margin: 0 auto; /* Center the image */
    }
  </style>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
  <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="text-align: center; padding: 20px 10px;">
        <h1 style="margin: 0; font-size: 28px; color: #333333;">${title}</h1>
        <h4 style="margin: 5px 0 0 0; font-size: 18px; color: #555555;">${subtitle}</h4>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 10px;">
        <img src="${data.posterPath}" alt="${data.name} poster" class="poster-img" />
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 22px; color: #333333;">Overview:</h3>
        <p style="padding: 0 15px; margin: 0; font-size: 16px; color: #555555;">${data.overview}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: center;">
        <h5 style="margin: 0 0 5px 0; font-size: 16px; color: #555555;">Genres: ${data.genres}</h5>
        <h5 style="margin: 0; font-size: 16px; color: #555555;">Runtime: ${data.runtime}</h5>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px;">
        <a href="${data.serverUrl}" class="button button-jellyfin" target="_blank">JELLYFIN</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td align="center" width="50%" style="padding: 0 5px 0 0;">
              <a href="${data.movieUrl}" class="button button-tmdb" target="_blank">TMDB</a>
            </td>
            <td align="center" width="50%" style="padding: 0 0 0 5px;">
              <a href="${data.imdbUrl}" class="button button-imdb" target="_blank">IMDb</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="font-size: 6px; line-height: 10px; padding: 10px 20px;" valign="top" align="center">
        <img class="backdrop-img" border="0" alt="Backdrop" src="${data.backdropPath}" />
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
