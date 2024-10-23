import express, { Request, Response } from "express"

const app = express()
const port = process.env.PORT || 3000

const baseUrl = "/webhook"
const baseRouter = express.Router()

app.use(baseUrl, baseRouter)

baseRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Webhook is active" })
})

baseRouter.post("/", (req: Request, res: Response) => {
  console.log(req.body)
  res.status(200).json({ message: "Webhook received" })
})

baseRouter.post("/test", (req: Request, res: Response) => {
  printRequest(req)
  res.status(200).json({ message: "Webhook received" })
})

function printRequest(req: Request) {
  console.log("Headers: ", req.headers)
  console.log("Body: ", req.body)
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port + baseUrl}`)
})
