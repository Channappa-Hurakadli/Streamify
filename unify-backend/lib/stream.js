import {StreamChat} from "stream-chat"
import dotenv from "dotenv"

dotenv.config()

const apiKey = process.env.UNIFY_API_KEY
const apiSecret = process.env.UNIFY_SECRET_KEY

if(!apiKey || !apiSecret) {
  console.error("API key and secret key must be provided")
}

const unifyClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertUnifyUser = async (userData)=>{
    try {
        await unifyClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("Error in upserting user to Unify", error)
    }
}

export const generateUnifyToken = (userId) => {
    //later
}