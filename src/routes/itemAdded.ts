import express, { Request, Response } from "express"
import { sendSendgridEmail } from "../services/sendgridService"
import { sendSMTPEmail } from "../services/smtpService"
import { getTmdbData } from "../services/tmdbService"

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  console.log(req.headers, req.body)
  if (!req.body.Provider_tmdb) {
    res
      .status(400)
      .json({ message: "TMDB ID not found in body (Provider_tmdb)" })
    return
  }

  let tmdbResponse
  try {
    tmdbResponse = await getTmdbData(req.body.Provider_tmdb)
  } catch (error: any) {
    res
      .status(error.status)
      .json({ message: "Unable to get details from TMDB", tmdbErrors: error })
    return
  }

  if (process.env.MAIL_PROVIDER?.toLowerCase() === "smtp") {
    try {
      await sendSMTPEmail(tmdbResponse)
    } catch (error: any) {
      res.status(500).json({ smtpErrors: error })
      return
    }
  } else {
    try {
      await sendSendgridEmail(tmdbResponse)
    } catch (error: any) {
      res
        .status(error.code)
        .json({ sendgridErrors: error.response.body.errors })
      return
    }
  }
  res
    .status(200)
    .json({ message: "Email successfully delivered", data: tmdbResponse })
})

export default router
