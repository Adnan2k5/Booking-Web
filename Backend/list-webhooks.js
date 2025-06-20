import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Script to list existing Revolut webhooks
async function listWebhooks() {
    try {
        const config = {
            method: 'get',
            url: 'https://sandbox-merchant.revolut.com/api/1.0/webhooks',
            headers: { 
                'Accept': 'application/json', 
                'Authorization': `Bearer ${process.env.REVOLUT_SECRET_API_KEY}`
            }
        };

        console.log('Fetching existing webhooks...');
        const response = await axios(config);
        console.log('Existing webhooks:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching webhooks:', error.response?.data || error.message);
    }
}

listWebhooks();
