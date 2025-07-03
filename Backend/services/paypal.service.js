

import { Client, Environment } from '@paypal/paypal-server-sdk';

export default class PayPalService {
  constructor() {
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
      },
      timeout: 0,
      environment: Environment.Sandbox, // Use Environment.Production for live
    });
  }

  async createOrder(amount, currency = 'USD') {
    const ordersController = this.client.ordersController;
    
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

    try {
      const response = await ordersController.ordersCreate({
        body: orderRequest,
      });
      
      if (response.statusCode === 201) {
        return response.result;
      } else {
        throw new Error(`PayPal API returned status: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  }

  async captureOrder(orderId) {
    const ordersController = this.client.ordersController;

    try {
      const response = await ordersController.ordersCapture({
        id: orderId,
      });
      
      if (response.statusCode === 201) {
        return response.result;
      } else {
        throw new Error(`PayPal capture failed with status: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    const ordersController = this.client.ordersController;

    try {
      const response = await ordersController.ordersGet({
        id: orderId,
      });
      
      if (response.statusCode === 200) {
        return response.result;
      } else {
        throw new Error(`PayPal get order failed with status: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Error getting PayPal order:', error);
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
}