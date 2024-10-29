import express, { Request, Response } from "express"

const app = express()
const port = process.env.PORT || 3000

const baseUrl = "/webhook"
const baseRouter = express.Router()

interface TmdbBaseData {
  apiKey: string
  movieUrl: string
  tvUrl: string
  posterUrl: string
  imdbUrl: string
}

interface TmdbResponse {
  genres: string
  homepage: string
  id: number
  overview: string
  posterPath: string
  releaseDate: string
  runtime: number
  tagline: string
  title: string
  movieUrl: string
  imdbUrl: string
}

const tmdbData: TmdbBaseData = {
  apiKey: process.env.TMDB_API_KEY || "",
  movieUrl: "https://www.themoviedb.org/movie/",
  tvUrl: "https://www.themoviedb.org/tv/",
  posterUrl: "https://image.tmdb.org/t/p/original",
  imdbUrl: "https://www.imdb.com/title/",
}

if (!tmdbData.apiKey) {
  console.error("TMDB API Key not found")
  process.exit(1)
}

app.use(express.json())

app.use(baseUrl, baseRouter)

baseRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Webhook is active" })
})

baseRouter.post("/", async (req: Request, res: Response) => {
  printRequest(req)
  if (!bodyContainsTmdbId(req.body)) {
    res.status(400).json({ message: "TMDB ID not found in body" })
    return
  }

  let tmdbResponse
  try {
    tmdbResponse = await fetchTmdbData(req.body.Provider_tmdb)
  } catch (error: any) {
    console.error(error)
    const status = error.status || 500
    const message = error.message || "Error fetching data from TMDB"
    res.status(status).json({ message })
    return
  }
  const formattedResponse = formatTmdbResponse(tmdbResponse)

  const sgMail = require("@sendgrid/mail")
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: process.env.SENDGRID_RECEIVER_EMAIL,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject:
      "A new movie has been added to Jellyfin " +
      formattedResponse.title +
      ` (${formattedResponse.releaseDate})`,
    text: "and easy to do anywhere, even with Node.js",
    html: generateHtmlTemplate(formattedResponse),
  }
  sgMail.send(msg)

  res.status(200).json(formattedResponse)
})

function printRequest(req: Request) {
  console.log("Headers: ", req.headers)
  console.log("Body: ", req.body)
}

function bodyContainsTmdbId(body: Request["body"]) {
  // Provider_tmdb is the key that contains the TMDB ID
  // This is sent when all details are sent to the webhook with no template and
  // the jellyfin server uses tmdb for metadata.
  if (!body.Provider_tmdb) {
    return false
  }
  return true
}

async function fetchTmdbData(tmdbId: string) {
  const url: string = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbData.apiKey}`
  const tmdbResponse = await fetch(url).then((response) => {
    if (!response.ok) {
      throw {
        status: response.status,
        message: "TMDB ERROR: " + response.statusText,
      }
    }
    return response.json()
  })

  console.log("TMDB Response: ", tmdbResponse)
  return tmdbResponse
}

function formatTmdbResponse(response: any): TmdbResponse {
  return {
    genres: response.genres
      .map((genre: { id: number; name: string }) => genre.name)
      .join(", "),
    homepage: response.homepage,
    id: response.id,
    overview: response.overview,
    posterPath: `${tmdbData.posterUrl}${response.poster_path}`,
    releaseDate: response.release_date,
    runtime: response.runtime,
    tagline: response.tagline,
    title: response.title,
    movieUrl: `${tmdbData.movieUrl}${response.id}`,
    imdbUrl: `${tmdbData.imdbUrl}${response.imdb_id}`,
  }
}

function generateHtmlTemplate(data: any) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="text-align: center;">New Movie Added to Jellyfin</h2>
        <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; padding: 10px;">
              <img
                src="${data.posterPath}"
                alt="${data.title} poster"
                style="width: 100%; max-width: 300px; height: auto; border-radius: 10px;"
              />
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: center;">
              <h3>${data.title} (${data.releaseDate})</h3>
              <p style="padding: 0 15px;">${data.overview}</p>
            </td>
          </tr>
        </table>
        <footer style="text-align: center; margin-top: 20px;">
          <p style="font-size: 12px; color: #888;">Jellyfin Notifications &copy; 2024</p>
        </footer>
      </body>
    </html>
  `
}

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port + baseUrl}`)
})
