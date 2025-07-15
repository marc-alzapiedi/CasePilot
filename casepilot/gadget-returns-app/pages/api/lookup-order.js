import { Client } from "@gadget-client/casepilot";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, postalCode } = req.body;

    if (!email || !postalCode) {
        return res.status(400).json({ error: 'Email and postal code are required' });
    }

    try {
        const client = new Client({
            apiKey: process.env.GADGET_API_KEY
        });

        // Call your Gadget global action here
        // Replace 'lookupOrder' with your actual action name
        const result = await client.globalAction.lookupOrder({
            email,
            postalCode
        });

        res.status(200).json({
            success: true,
            orders: result.orders || []
        });
    } catch (error) {
        console.error('Gadget API error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to lookup orders'
        });
    }
}
