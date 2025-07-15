// import { Client } from "@gadget-client/casepilot"
import { getApi } from "../../../web/api"
import Cors from "cors"
import { initMiddleware } from "../../lib/init-middleware"

const cors = initMiddleware(
    Cors({
        origin: "http://localhost:5173",
        methods: ["POST", "GET", "OPTIONS"],
        credentials: true
    })
)


// const api = new Client({
//     authenticationMode: {
//         apiKey: process.env.GADGET_API_KEY
//     }
// })

const api = getApi({ standalone: true, environment: process.env.NODE_ENV})




export default async function handler(req, res) {
    await cors(req, res)
    


    if(req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed")
        
    const { email, postalCode } = req.body
    

  
    try {

        console.log(email, postalCode)
        const response = await api.orderData({
            email: email,
            postalCode: postalCode
        })


        res.status(200).json(response)
    } catch (err) {
        res.status(500).json({ success: false, error: err})
    }
}