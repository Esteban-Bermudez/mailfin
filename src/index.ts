import express from "express"
import emailRouter from "./routes/email"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use("/email", emailRouter)

app.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
