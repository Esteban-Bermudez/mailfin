import express, { Request, Response } from "express"

const app = express()
const port = process.env.PORT || 3000

const baseUrl = "/webhook"
const baseRouter = express.Router()

interface TMDBData {
  apiKey: string
  movieURL: string
  tvURL: string
  posterURL: string
}

const tmdbData: TMDBData = {
  apiKey: process.env.TMDB_API_KEY || "",
  movieURL: "https://www.themoviedb.org/movie/",
  tvURL: "https://www.themoviedb.org/tv/",
  posterURL: "https://image.tmdb.org/t/p/original",
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
  const tmdbResponse = await fetchTmdbData(req.body.Provider_tmdb)
  // TODO: Need to handle error response from TMDB API
  res.status(200).json(tmdbResponse)
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
    return response.json()
  })
  if (tmdbResponse.status_code) {
    return { message: "Movie not found" }
  }
  return tmdbResponse
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port + baseUrl}`)
})
