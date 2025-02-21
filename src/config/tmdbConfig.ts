interface TmdbBaseData {
  apiKey: string
  movieUrl: string
  tvUrl: string
  posterUrl: string
  backdropUrl: string
  imdbUrl: string
}

export interface TmdbResponse {
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
  tvUrl: string
  imdbUrl: string
  emails: string
}

export const tmdbData: TmdbBaseData = {
  apiKey: process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_KEY || "",
  movieUrl: "https://www.themoviedb.org/movie/",
  tvUrl: "https://www.themoviedb.org/tv/",
  // Can be refactored to use TMDB's image configuration endpoint
  posterUrl: "https://image.tmdb.org/t/p/original",
  backdropUrl: "https://image.tmdb.org/t/p/original",

  imdbUrl: "https://www.imdb.com/title/",
}

if (!tmdbData.apiKey) {
  console.error("TMDB API Key not found")
  process.exit(1)
}
