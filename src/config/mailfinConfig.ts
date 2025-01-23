export interface MailfinResponse {
  name: string
  seriesName: string
  overview: string
  serverName: string

  itemType: string
  tmdbId: number
  serverId: string

  genres: string
  tagline: string

  releaseDate: string
  releaseYear: number
  runtime: number

  episodeCount: number
  seasonCount: number
  seasonEpisodeCount: number
  episodeNumber: number
  seasonNumber: number

  emails: string
  homepage: string
  posterPath: string
  backdropPath: string

  movieUrl: string
  tvUrl: string
  imdbUrl: string
  tmdbUrl: string
  serverUrl: string
}
