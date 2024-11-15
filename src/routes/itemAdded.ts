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
    res.status(error.status).json({ tmdbError: error })
    return
  }

  if (process.env.MAIL_PROVIDER?.toLowerCase() === "smtp") {
    await sendSMTPEmail(tmdbResponse)
  } else {
    await sendSendgridEmail(tmdbResponse)
  }
  res.status(200).json(tmdbResponse)
})

export default router
