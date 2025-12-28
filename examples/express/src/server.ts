import path from "node:path"
import { fileURLToPath } from "node:url"
import cookieParser from "cookie-parser"
import express from "express"
import { Vla } from "vla"
import { AppContext } from "./data/context"
import { ApiListPosts, CreatePost, ShowHome } from "./data/home.actions"
import { kernel } from "./data/kernel"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  Vla.withKernel(kernel.scoped().context(AppContext, { req, res }), next)
})
app.use(express.json())
app.use(cookieParser())

// View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "./views"))

// Routes
app.get("/", () => ShowHome.invoke())
app.post("/posts", () => CreatePost.invoke())
app.get("/api/posts", () => ApiListPosts.invoke())

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
