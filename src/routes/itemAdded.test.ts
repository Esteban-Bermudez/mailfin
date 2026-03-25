import { expect, test, describe, mock } from "bun:test"
import request from "supertest"
import app from "../index"
import starWarsFixture from "../tests/fixtures/star-wars-movie.json"

describe("POST /item-added/smtp", () => {
  test("should call TMDB and SMTP services and return success", async () => {
    // Mock the dependencies
    mock.module("../services/tmdbService", () => ({
      getTmdbData: () => Promise.resolve(starWarsFixture.data),
    }))
    mock.module("../services/smtpService", () => ({
      sendSMTPEmail: () => Promise.resolve(),
    }))

    const response = await request(app).post("/item-added/smtp").send({
      ItemType: "Movie",
      Provider_tmdb: 11,
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(starWarsFixture)
  })
})
