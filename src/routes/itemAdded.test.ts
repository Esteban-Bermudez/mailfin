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

  test("should parse a JSON body sent as text/plain (Jellyfin webhook default)", async () => {
    // Jellyfin's generic webhook plugin sends the body with Content-Type:
    // text/plain by default (see jellyfin-plugin-webhook GenericClient.cs).
    mock.module("../services/tmdbService", () => ({
      getTmdbData: () => Promise.resolve(starWarsFixture.data),
    }))
    mock.module("../services/smtpService", () => ({
      sendSMTPEmail: () => Promise.resolve(),
    }))

    const response = await request(app)
      .post("/item-added/smtp")
      .set("Content-Type", "text/plain")
      .send(JSON.stringify({ ItemType: "Movie", Provider_tmdb: 11 }))

    expect(response.status).toBe(200)
    expect(response.body).toEqual(starWarsFixture)
  })

  test("should return 400 when the body is not valid JSON", async () => {
    const response = await request(app)
      .post("/item-added/smtp")
      .set("Content-Type", "text/plain")
      .send("this is not json")

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Request body must be valid JSON")
  })
})
