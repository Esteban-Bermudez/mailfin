import express, { Request, Response } from "express"
import itemAddedRouter from "./routes/itemAdded"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const baseRouter = express.Router()
baseRouter.get("/", (req: Request, res: Response) => {
  console.log(req.headers, req.body)
  res.status(200).json({ message: "Mailfin is Active" })
})

// Routes
app.use("/", baseRouter)
app.use("/item-added", itemAddedRouter)

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
