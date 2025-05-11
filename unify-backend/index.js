import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.listen(PORT,()=>{
    console.log(`Server Started on PORT:${PORT}`)
    connectDB()
})