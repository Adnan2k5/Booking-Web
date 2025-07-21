import axios from 'axios';

export default class PayPalService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  async getAccessToken() {
    try {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        throw new Error('PayPal credentials are not configured properly');
      }

      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

      const response = await axios.post(`${this.baseURL}/v1/oauth2/token`,
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
      
      if (error.response?.status === 401) {
        throw new Error('PayPal authentication failed - Invalid client credentials');
      }
      
      throw new Error(`Failed to get access token: ${error.response?.status || 'Network error'}`);
    }
  }

  encodeObjectToBase64(object) {
    return Buffer.from(JSON.stringify(object)).toString("base64");
  }

  createPayPalAuthAssertion(clientId, payeeId) {
    const header = { alg: "none" };
    const encodedHeader = this.encodeObjectToBase64(header);
    const payloadAssertion = { iss: clientId, payer_id: payeeId };
    const encodedPayload = this.encodeObjectToBase64(payloadAssertion);
    return `${encodedHeader}.${encodedPayload}.`;
  }

  async createOrder(totalAmount, currency) {
    try {
      const accessToken = await this.getAccessToken();
      const purchase_units = [{
        amount: {
          currency_code: currency || "USD",
          value: totalAmount.toFixed(2)
        }
      }];

      const payload = {
        intent: "CAPTURE",
        purchase_units: purchase_units,
        application_context: {
          return_url: `${process.env.CLIENT_URL}/payment/approve`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
        }
      };

      const response = await axios.post(`${this.baseURL}/v2/checkout/orders`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating PayPal order:', error.response?.data || error.message);
      throw new Error(`PayPal API error: ${error.response?.status} - ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  async getOrder(orderId, payeeId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      };

      // Only add marketplace headers if payeeId is provided
      if (payeeId) {
        const paypalAuthAssertion = this.createPayPalAuthAssertion(
          process.env.PAYPAL_CLIENT_ID, 
          payeeId
        );
        headers["PayPal-Partner-Attribution-Id"] = process.env.PAYPAL_PARTNER_ATTRIBUTION_ID;
        headers["PayPal-Auth-Assertion"] = paypalAuthAssertion;
      }

      const response = await axios.get(`${this.baseURL}/v2/checkout/orders/${orderId}`, {
        headers: headers
      });

      return response.data;
    } catch (error) {
      console.error('Error getting PayPal order:', error.response?.data || error.message);
      throw error;
    }
  }

  async confirmPaymentSource(orderId, paymentSource, payeeId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      };

      // Only add marketplace headers if payeeId is provided
      if (payeeId) {
        const paypalAuthAssertion = this.createPayPalAuthAssertion(
          process.env.PAYPAL_CLIENT_ID, 
          payeeId
        );
        headers["PayPal-Partner-Attribution-Id"] = process.env.PAYPAL_PARTNER_ATTRIBUTION_ID;
        headers["PayPal-Auth-Assertion"] = paypalAuthAssertion;
      }

      const response = await axios.post(`${this.baseURL}/v2/checkout/orders/${orderId}/confirm-payment-source`, 
        { payment_source: paymentSource }, 
        {
          headers: headers
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error confirming payment source:', error.response?.data || error.message);
      throw error;
    }
  }

  async captureOrder(orderId) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(`${this.baseURL}/v2/checkout/orders/${orderId}/capture`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        console.log('Order already captured or processed');
        return null;
      }
      console.error('Error capturing PayPal order:', error.response?.data || error.message);
      throw error;
    }
  }

}