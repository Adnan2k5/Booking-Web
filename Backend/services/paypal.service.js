import { Client, Environment } from '@paypal/paypal-server-sdk';
import axios from 'axios';

export default class PayPalService {
  constructor() {
    try {
      console.log('Initializing PayPal service...');
      console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID ? 'Set' : 'Not set');
      console.log('PayPal Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? 'Set' : 'Not set');
      
      this.client = new Client({
        clientCredentialsAuthCredentials: {
          oAuthClientId: process.env.PAYPAL_CLIENT_ID,
          oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
        },
        timeout: 0,
        environment: Environment.Sandbox, // Use Environment.Production for live
      });
      
      console.log('PayPal client initialized:', !!this.client);
      console.log('Orders controller available:', !!this.client.ordersController);
    } catch (error) {
      console.error('Error initializing PayPal service:', error);
      throw error;
    }
  }

  async createOrder(amount, currency = 'USD') {
    try {
      console.log('Creating PayPal order...');
      console.log('Client available:', !!this.client);
      
      // First, try using the SDK
      try {
        let ordersController;
        try {
          ordersController = this.client.ordersController;
        } catch (error) {
          console.error('Error accessing ordersController:', error);
          throw new Error('Unable to access PayPal orders controller');
        }
        
        if (!ordersController) {
          throw new Error('Orders controller not available. Check PayPal SDK initialization.');
        }
        
        const orderRequest = {
          intent: 'CAPTURE',
          purchaseUnits: [
            {
              amount: {
                currencyCode: currency,
                value: amount.toFixed(2),
              },
            },
          ],
        };

        console.log('Creating PayPal order with SDK:', JSON.stringify(orderRequest, null, 2));
        
        const response = await ordersController.ordersCreate({
          body: orderRequest,
        });
        
        console.log('PayPal order response:', response);
        
        if (response && response.statusCode === 201) {
          return response.result;
        } else {
          throw new Error(`PayPal API returned status: ${response?.statusCode || 'unknown'}`);
        }
      } catch (sdkError) {
        console.warn('PayPal SDK failed, falling back to direct API:', sdkError.message);
        
        // Fallback to direct API call
        return await this.createOrderDirect(amount, currency);
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  // Alternative method using direct API calls
  async createOrderDirect(amount, currency = 'USD') {
    try {
      console.log('Creating PayPal order using direct API...');
      
      // Get access token first
      const accessToken = await this.getAccessToken();
      
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
      };

      const response = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('PayPal order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating PayPal order via direct API:', error.response?.data || error.message);
      throw new Error(`PayPal API error: ${error.response?.status} - ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  async getAccessToken() {
    try {
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
      
      const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting PayPal access token:', error.response?.data || error.message);
      throw new Error(`Failed to get access token: ${error.response?.status} - ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  async captureOrder(orderId) {
    try {
      // Try SDK first
      try {
        const ordersController = this.client.ordersController;
        
        if (!ordersController) {
          throw new Error('Orders controller not available');
        }

        const response = await ordersController.ordersCapture({
          id: orderId,
        });
        
        if (response.statusCode === 201) {
          return response.result;
        } else {
          throw new Error(`PayPal capture failed with status: ${response.statusCode}`);
        }
      } catch (sdkError) {
        console.warn('PayPal SDK capture failed, falling back to direct API:', sdkError.message);
        
        // Fallback to direct API
        const accessToken = await this.getAccessToken();
        
        const response = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        return response.data;
      }
    } catch (error) {
      console.error('Error capturing PayPal order:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrder(orderId) {
    try {
      // Try SDK first
      try {
        const ordersController = this.client.ordersController;
        
        if (!ordersController) {
          throw new Error('Orders controller not available');
        }

        const response = await ordersController.ordersGet({
          id: orderId,
        });
        
        if (response.statusCode === 200) {
          return response.result;
        } else {
          throw new Error(`PayPal get order failed with status: ${response.statusCode}`);
        }
      } catch (sdkError) {
        console.warn('PayPal SDK get order failed, falling back to direct API:', sdkError.message);
        
        // Fallback to direct API
        const accessToken = await this.getAccessToken();
        
        const response = await axios.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        return response.data;
      }
    } catch (error) {
      console.error('Error getting PayPal order:', error.response?.data || error.message);
      throw error;
    }
  }

  // Helper method to verify webhook signature
  async verifyWebhookSignature(headers, body, webhookId) {
    const webhooksController = this.client.webhooksController;
    
    const verifyRequest = {
      authAlgo: headers['paypal-auth-algo'],
      certId: headers['paypal-cert-id'],
      headers: {
        'paypal-transmission-id': headers['paypal-transmission-id'],
        'paypal-cert-id': headers['paypal-cert-id'],
        'paypal-auth-algo': headers['paypal-auth-algo'],
        'paypal-transmission-time': headers['paypal-transmission-time'],
        'paypal-auth-version': headers['paypal-auth-version'],
      },
      transmissionId: headers['paypal-transmission-id'],
      webhookEvent: body,
      webhookId: webhookId,
    };

    try {
      const response = await webhooksController.verifyWebhookSignature({
        body: verifyRequest,
      });
      
      return response.result.verificationStatus === 'SUCCESS';
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  // Test method to verify PayPal SDK functionality
  async testConnection() {
    try {
      console.log('Testing PayPal connection...');
      console.log('Client available:', !!this.client);
      console.log('Orders controller available:', !!this.client.ordersController);
      
      // List available methods on the orders controller
      if (this.client.ordersController) {
        console.log('Orders controller methods:', Object.getOwnPropertyNames(this.client.ordersController.__proto__));
      }
      
      return true;
    } catch (error) {
      console.error('PayPal connection test failed:', error);
      return false;
    }
  }
}