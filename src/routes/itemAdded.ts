import express, { Request, Response } from "express";
import { sendSendgridEmail } from "../services/sendgridService";
import { sendSMTPEmail } from "../services/smtpService";
import { getTmdbData } from "../services/tmdbService";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  printRequest(req)
  if (!req.body.Provider_tmdb) {
    res.status(400).json({ message: "TMDB ID not found in body" })
    return
  }

  let tmdbResponse
  try {
    tmdbResponse = await getTmdbData(req.body.Provider_tmdb)
  } catch (error: any) {
    console.error(error)
    const status = error.status || 500
    const message = error.message || "Error fetching data from TMDB"
    res.status(status).json({ message })
    return
  }

  if (process.env.MAIL_PROVIDER?.toLowerCase() === "smtp") {
    await sendSMTPEmail(tmdbResponse)
  } else {
    await sendSendgridEmail(tmdbResponse)
  }
  res.status(200).json(tmdbResponse)
})

function printRequest(req: Request) {
  console.log("Headers: ", req.headers)
  console.log("Body: ", req.body)
}

export default router;
