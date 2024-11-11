import express, { Request, Response } from "express";
import {tmdbData, TmdbResponse} from "../config/tmdbConfig";
import { sendSendgridEmail } from "../services/sendgridService";
import { sendSMTPEmail } from "../services/smtpService";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Webhook is active" })
})

router.post("/", async (req: Request, res: Response) => {
  printRequest(req)
  if (!req.body.Provider_tmdb) {
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

  if (process.env.MAIL_PROVIDER?.toLowerCase() === "smtp") {
    await sendSMTPEmail(formattedResponse)
  } else {
    await sendSendgridEmail(formattedResponse)
  }
  res.status(200).json(formattedResponse)
})

function printRequest(req: Request) {
  console.log("Headers: ", req.headers)
  console.log("Body: ", req.body)
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
    posterPath: `${tmdbData.posterUrl}${response.poster_path}`,
    releaseDate: response.release_date,
    runtime: response.runtime,
    tagline: response.tagline,
    title: response.title,
    movieUrl: `${tmdbData.movieUrl}${response.id}`,
    imdbUrl: `${tmdbData.imdbUrl}${response.imdb_id}`,
  }
}

export default router;
