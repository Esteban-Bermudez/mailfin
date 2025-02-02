import { tmdbData } from "../config/tmdbConfig"
import { MailfinResponse } from "../config/mailfinConfig"

export async function getTmdbData(requestBody: any) {
  if (!requestBody.ItemType) {
    const statusText = "Item Type not found in body (ItemType)"
    throw {
      status: 400,
      statusText: statusText,
    }
  }

  if (!requestBody.Provider_tmdb) {
    // Return the data that is pulled from Jellyfin
    return formatTmdbResponse(null, requestBody)
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

  return formatTmdbResponse(tmdbResponse, requestBody)
}

export function formatTmdbResponse(
  response: any,
  jellyfinData: any,
): MailfinResponse {

  let jellyfinPosterPath
  let jellyfinBackdropPath

  if (jellyfinData.ServerUrl && jellyfinData.ItemId) {
    jellyfinPosterPath = `${jellyfinData.ServerUrl}/Items/${jellyfinData.ItemId}/Images/Primary`
    jellyfinBackdropPath = `${jellyfinData.ServerUrl}/Items/${jellyfinData.ItemId}/Images/Backdrop`
  }

  if (jellyfinData.SeriesId) {
    jellyfinBackdropPath = `${jellyfinData.ServerUrl}/Items/${jellyfinData.SeriesId}/Images/Thumb`
  }

  return {
    emails: jellyfinData.Emails || process.env.SENDGRID_RECEIVER_EMAIL || "",

    itemType: jellyfinData.ItemType || "No Item Type",
    tmdbId: jellyfinData.Provider_tmdb || 0,
    serverId: jellyfinData.ItemId || "",
    serverName: jellyfinData.ServerName || "",

    seasonCount: jellyfinData.SeasonCount || 0,
    seasonEpisodeCount: jellyfinData.SeasonEpisodeCount || 0,
    episodeCount: jellyfinData.EpisodeCount || 0,
    episodeNumber: jellyfinData.EpisodeNumber || 0,
    seasonNumber: jellyfinData.SeasonNumber || 0,

    overview: jellyfinData?.Overview || response?.overview || "",
    genres:
      jellyfinData.Genres ||
      response?.genres
        .map((genre: { id: number; name: string }) => genre.name)
        .join(", ") ||
      "",
    tagline: jellyfinData.Tagline || response?.tagline || "",

    homepage: response?.homepage || "",
    posterPath: jellyfinPosterPath || tmdbData.posterUrl + response?.poster_path || "",
    backdropPath: jellyfinBackdropPath || tmdbData.posterUrl + response?.backdrop_path || "",

    releaseYear: jellyfinData.Year || response.release_date.slice(0, 4) || 0,
    releaseDate:
      jellyfinData.PremiereDate ||
      response.release_date ||
      response.first_air_date ||
      "No Release Date",

    runtime: jellyfinData.RunTime|| response?.runtime || 0,
    name:
      jellyfinData.Name ||
      jellyfinData.SeriesName ||
      response.title ||
      response.name ||
      "No Name",
    seriesName: jellyfinData.SeriesName || response.name || "",

    serverUrl:
      jellyfinData.ServerUrl +
        "/web/index.html#!/details?id=" +
        jellyfinData.ItemId || "",
    movieUrl: `${tmdbData.movieUrl}${response?.id}` || "",
    tvUrl: `${tmdbData.tvUrl}${response?.id}` || "",
    imdbUrl: `${tmdbData.imdbUrl}${response?.imdb_id}` || "",
    tmdbUrl: `${tmdbData.movieUrl}${response?.id}` || "",
  }
}
