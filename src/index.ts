import express, { Request, Response } from "express"
import itemAddedRouter from "./routes/itemAdded"

const app = express()
const port = process.env.PORT || 3000
var morgan = require('morgan')

app.use(express.json())
app.use(morgan('combined'))

const baseRouter = express.Router()
baseRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Mailfin is Active" })
})

// Routes
app.use("/", baseRouter)
app.use("/item-added", itemAddedRouter)

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
