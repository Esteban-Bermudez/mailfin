import { tmdbData, TmdbResponse } from "../config/tmdbConfig"

export async function getTmdbData(requestBody: any) {
  if (!requestBody.Provider_tmdb || !requestBody.ItemType) {
    const statusText = !requestBody.Provider_tmdb
      ? "TMDB ID not found in body (Provider_tmdb)"
      : "Item Type not found in body (ItemType)"

    throw {
      status: 400,
      statusText: statusText,
    }
  }

  const tmdbId: number = requestBody.Provider_tmdb

  const url =
    requestBody.ItemType === "Movie"
      ? `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbData.apiKey}`
      : `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${tmdbData.apiKey}`

  const tmdbResponse = await fetch(url).then((response) => {
    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
      }
    }
    return response.json()
  })

  return formatTmdbResponse(tmdbResponse, requestBody.emails)
}

export function formatTmdbResponse(response: any, emails: string): TmdbResponse {
  return {
    genres: response.genres
      .map((genre: { id: number; name: string }) => genre.name)
      .join(", "),
    homepage: response.homepage,
    id: response.id,
    overview: response.overview,
    posterPath: `${tmdbData.posterUrl}${response.poster_path}`,
    releaseDate: response.release_date || response.first_air_date,
    runtime: response.runtime,
    tagline: response.tagline,
    title: response.title || response.name,
    movieUrl: `${tmdbData.movieUrl}${response.id}`,
    tvUrl: `${tmdbData.tvUrl}${response.id}`,
    imdbUrl: `${tmdbData.imdbUrl}${response.imdb_id}`,
    emails: emails,
  }
}
