import express, { Request, Response, NextFunction } from "express"
import { sendSendgridEmail } from "./services/sendgridService"
import { sendSMTPEmail } from "./services/smtpService"
import { getTmdbData } from "./services/tmdbService"

const app = express()
const port = process.env.PORT || 3000

// Jellyfin's generic webhook plugin sends the body as `text/plain` by default,
// so parse JSON from any content type instead of only application/json.
app.use(express.json({ type: "*/*" }))

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ message: "Request body must be valid JSON" })
    return
  }
  next(err)
})

const baseRouter = express.Router()
baseRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Mailfin is Active" })
})

// Routes
app.use("/", baseRouter)

// Express wrapper for item-added routes
app.post("/item-added", async (req: Request, res: Response) => {
  let tmdbResponse
  try {
    tmdbResponse = await getTmdbData(req.body)
  } catch (error: any) {
    console.log("Error getting data from TMDB", error)
    res.status(error.status || 500).json({ tmdbErrors: error })
    return
  }

  try {
    await sendSendgridEmail(tmdbResponse)
  } catch (error: any) {
    res
      .status(error.code || 500)
      .json({ sendgridErrors: error.response?.body?.errors })
    return
  }
  res
    .status(200)
    .json({ message: "Email successfully delivered", data: tmdbResponse })
})

app.post("/item-added/sendgrid", async (req: Request, res: Response) => {
  let tmdbResponse
  try {
    tmdbResponse = await getTmdbData(req.body)
  } catch (error: any) {
    console.log("Error getting data from TMDB", error)
    res.status(error.status || 500).json({ tmdbErrors: error })
    return
  }

  try {
    await sendSendgridEmail(tmdbResponse)
  } catch (error: any) {
    res
      .status(error.code || 500)
      .json({ sendgridErrors: error.response?.body?.errors })
    return
  }
  res
    .status(200)
    .json({ message: "Email successfully delivered", data: tmdbResponse })
})

app.post("/item-added/smtp", async (req: Request, res: Response) => {
  let tmdbResponse
  try {
    tmdbResponse = await getTmdbData(req.body)
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ message: "Unable to get details from TMDB", tmdbErrors: error })
    return
  }

  try {
    await sendSMTPEmail(tmdbResponse)
  } catch (error: any) {
    res.status(500).json({ smtpErrors: error })
    return
  }

  res
    .status(200)
    .json({ message: "Email successfully delivered", data: tmdbResponse })
})

export default app

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://0.0.0.0:${port}`)
  })
}
