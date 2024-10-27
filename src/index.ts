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

  try {
    const tmdbResponse = await fetchTmdbData(req.body.Provider_tmdb)
    const formattedResponse = formatTmdbResponse(tmdbResponse)
    res.status(200).json(formattedResponse)
  } catch (error: any) {
    console.error(error)
    const status = error.status || 500
    const message = error.message || "Error fetching data from TMDB"
    res.status(status).json({ message })
  }
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
    posterPath: `${tmdbData.posterUrl}${response.posterPath}`,
    releaseDate: response.releaseDate,
    runtime: response.runtime,
    tagline: response.tagline,
    title: response.title,
    movieUrl: `${tmdbData.movieUrl}${response.id}`,
    imdbUrl: `${tmdbData.imdbUrl}${response.imdbId}`,
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port + baseUrl}`)
})
