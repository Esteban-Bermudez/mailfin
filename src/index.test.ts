import { expect, test, describe } from "bun:test"
import request from "supertest"
import app from "./index"

describe("Mailfin API", () => {
  test("GET / should return 200 and success message", async () => {
    const response = await request(app).get("/")
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Mailfin is Active")
  })
})
