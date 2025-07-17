import { Client } from "@gadget-client/casepilot"
import Cors from "cors"
import { initMiddleware } from "../../lib/init-middleware"

const cors = initMiddleware(
    Cors({
        origin: "http://localhost:5173",
        methods: ["POST", "GET", "OPTIONS"],
        credentials: true
    })
)


const api = new Client({
    authenticationMode: {
        apiKey: process.env.GADGET_API_KEY
    }
})





export default async function handler(req, res) {
    await cors(req, res)
    


    if(req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed")
        
    const { email, postalCode, orderNumber } = req.body
    

  
    try {

        console.log(email, postalCode, orderNumber)

        const response = await api.orderData({
            email: email,
            postalCode: postalCode,
            orderNumber: orderNumber
        })


        res.status(200).json(response)
    } catch (err) {
        res.status(500).json({ success: false, error: err})
    }
}