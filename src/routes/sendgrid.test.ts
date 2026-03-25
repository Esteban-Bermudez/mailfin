import { expect, test, describe, mock } from "bun:test"
import request from "supertest"
import app from "../index"

describe("POST /item-added/sendgrid", () => {
  test("should call TMDB and SendGrid services and return success", async () => {
    // Mock the dependencies
    mock.module("../services/tmdbService", () => ({
      getTmdbData: () =>
        Promise.resolve({
          backdropPath:
            "https://image.tmdb.org/t/p/original/yUiXA68FfQeA8cRBhd0Ao0jIRZt.jpg",
          emails: "",
          episodeCount: 0,
          episodeNumber: 0,
          genres: "Adventure, Action, Science Fiction",
          homepage:
            "http://www.starwars.com/films/star-wars-episode-iv-a-new-hope",
          imdbUrl: "https://www.imdb.com/title/tt0076759",
          itemType: "Movie",
          movieUrl: "https://www.themoviedb.org/movie/11",
          name: "Star Wars",
          overview:
            "Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.",
          posterPath:
            "https://image.tmdb.org/t/p/original/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
          releaseDate: "1977-05-25",
          releaseYear: 1977,
          runtime: 121,
          seasonCount: 0,
          seasonEpisodeCount: 0,
          seasonNumber: 0,
          seriesName: "",
          serverId: "",
          serverName: "",
          serverUrl: "undefined/web/index.html#!/details?id=undefined",
          tagline: "A long time ago in a galaxy far, far away...",
          tmdbId: 11,
          tmdbUrl: "https://www.themoviedb.org/movie/undefined",
          tvUrl: "https://www.themoviedb.org/tv/11",
        }),
    }))
    mock.module("../services/sendgridService", () => ({
      sendSendgridEmail: () => Promise.resolve(),
    }))

    const response = await request(app).post("/item-added/sendgrid").send({
      ItemType: "Movie",
      Provider_tmdb: 11,
    })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Email successfully delivered")
    expect(response.body.data.name).toBe("Star Wars")
    expect(response.body.data.tmdbId).toBe(11)
  })
})
