import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Script to setup Revolut webhook
async function setupWebhook() {
    try {
        // Replace with your actual webhook URL
        const webhookUrl = 'https://79cc-2405-201-a423-5801-bd61-a10f-8a44-5862.ngrok-free.app/api/itemBooking/webhook/payment-completed';

        const data = JSON.stringify({
            "url": webhookUrl,
            "events": [
                "ORDER_COMPLETED",
                "ORDER_AUTHORISED"
            ]
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://sandbox-merchant.revolut.com/api/1.0/webhooks',
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json', 
                'Authorization': `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`
            },
            data: data
        };

        console.log('Setting up webhook with URL:', webhookUrl);
        console.log('Request payload:', data);

        const response = await axios(config);
        console.log('Webhook setup successful:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Webhook setup error:', error.response?.data || error.message);
    }
}

setupWebhook();
