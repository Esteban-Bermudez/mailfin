import express, { Request, Response } from "express"
import { sendSendgridEmail } from "../services/sendgridService"
import { sendSMTPEmail } from "../services/smtpService"
import { getTmdbData } from "../services/tmdbService"

const router = express.Router()

router.post(["/", "/sendgrid"], async (req: Request, res: Response) => {
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
    res.status(error.code).json({ sendgridErrors: error.response.body.errors })
    return
  }
  res
    .status(200)
    .json({ message: "Email successfully delivered", data: tmdbResponse })
})

router.post("/smtp", async (req: Request, res: Response) => {
  let tmdbResponse
  try {
    tmdbResponse = await getTmdbData(req.body)
  } catch (error: any) {
    res
      .status(error.status)
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
export default router
