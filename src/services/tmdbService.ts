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

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + tmdbData.apiKey,
    },
  }

  let tmdbId: number = requestBody.Provider_tmdb
  if (!requestBody.Provider_tmdb || requestBody.Provider_tmdb == "") {
    // Get the TMDB id by searching for the movie or series by name
    const query =
      requestBody.ItemType === "Movie"
        ? requestBody.Name
        : requestBody.SeriesName
    const searchURL = ` https://api.themoviedb.org/3/search/tv?query=${query}&page=1`
    const searchResponse = await fetch(searchURL, options).then((response) => {
      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
        }
      }
      return response.json()
    })

    try {
      tmdbId = searchResponse.results[0].id
    } catch (error: any) {
      throw {
        status: 404,
        statusText: "TMDB ID not found",
        tmdbErrors: error,
      }
    }
    requestBody["Provider_tmdb"] = tmdbId
  }

  let url
  if (requestBody.ItemType === "Movie") {
    url = `https://api.themoviedb.org/3/movie/${tmdbId}`
  } else if (requestBody.ItemType === "Season") {
    url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${requestBody.SeasonNumber}`
  } else if (requestBody.ItemType === "Episode") {
    url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${requestBody.SeasonNumber}/episode/${requestBody.EpisodeNumber}`
  } else {
    url = `https://api.themoviedb.org/3/tv/${tmdbId}`
  }

  const tmdbResponse = await fetch(url, options).then((response) => {
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
  let tmdbReleaseYear
  let tmdbGenres
  let tmdbPosterPath
  let tmdbSeasonEpisodeCount

  if (jellyfinData.ServerUrl && jellyfinData.ItemId) {
    jellyfinPosterPath = `${jellyfinData.ServerUrl}/Items/${jellyfinData.ItemId}/Images/Primary`
    jellyfinBackdropPath = `${jellyfinData.ServerUrl}/Items/${jellyfinData.ItemId}/Images/Backdrop`
  }

  if (jellyfinData.SeriesId) {
    jellyfinBackdropPath = `${jellyfinData.ServerUrl}/Items/${jellyfinData.SeriesId}/Images/Thumb`
  }

  if (response.release_date) {
    tmdbReleaseYear = response.release_date?.slice(0, 4)
    tmdbReleaseYear = parseInt(tmdbReleaseYear)
  } else if (response.air_date) {
    tmdbReleaseYear = response.air_date?.slice(0, 4)
    tmdbReleaseYear = parseInt(tmdbReleaseYear)
  }

  if (response.genres) {
    tmdbGenres = response.genres.map((genre: any) => genre.name).join(", ")
  }

  if (response.poster_path) {
    tmdbPosterPath = tmdbData.posterUrl + response.poster_path
  } else if (response.still_path) {
    tmdbPosterPath = tmdbData.posterUrl + response.still_path
  }

  if (response.episodes) {
    tmdbSeasonEpisodeCount = response.episodes.length
  }

  return {
    emails: jellyfinData.Emails || process.env.SENDGRID_RECEIVER_EMAIL || "",

    itemType: jellyfinData.ItemType || "No Item Type",
    tmdbId: jellyfinData.Provider_tmdb || 0,
    serverId: jellyfinData.ItemId || "",
    serverName: jellyfinData.ServerName || "",

    seasonCount: jellyfinData.SeasonCount || 0,
    seasonEpisodeCount:
      jellyfinData.SeasonEpisodeCount || tmdbSeasonEpisodeCount || 0,
    episodeCount: jellyfinData.EpisodeCount || 0,
    episodeNumber: jellyfinData.EpisodeNumber || 0,
    seasonNumber: jellyfinData.SeasonNumber || 0,

    overview: jellyfinData?.Overview || response?.overview || "",
    genres: jellyfinData.Genres || tmdbGenres || "",
    tagline: jellyfinData.Tagline || response?.tagline || "",

    homepage: response?.homepage || "",
    posterPath: jellyfinPosterPath || tmdbPosterPath || "",
    backdropPath:
      jellyfinBackdropPath ||
      tmdbData.posterUrl + response?.backdrop_path ||
      "",

    releaseYear: jellyfinData.Year || tmdbReleaseYear || 0,
    releaseDate:
      jellyfinData.PremiereDate ||
      response.release_date ||
      response.air_date ||
      "No Release Date",

    runtime: jellyfinData.RunTime || response?.runtime || 0,
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
    movieUrl: `${tmdbData.movieUrl}${jellyfinData?.Provider_tmdb}` || "",
    tvUrl: `${tmdbData.tvUrl}${jellyfinData?.Provider_tmdb}` || "",
    imdbUrl: `${tmdbData.imdbUrl}${response?.imdb_id}` || "",
    tmdbUrl: `${tmdbData.movieUrl}${response?.Provider_tmdb}` || "",
  }
}
