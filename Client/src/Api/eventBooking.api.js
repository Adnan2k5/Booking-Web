import { axiosClient } from '../AxiosClient/axios';

// Create event booking (this now creates booking and payment order in one step)
export const createEventBooking = async (bookingData) => {
  try {
    const { data } = await axiosClient.post(
      '/api/event-bookings',
      bookingData,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// Get event booking by ID
export const getEventBookingById = async (id) => {
  try {
    const { data } = await axiosClient.get(`/api/event-bookings/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Get current user's event bookings
export const getMyEventBookings = async (params = {}) => {
  try {
    const { data } = await axiosClient.get('/api/event-bookings/user', {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (bookingId) => {
  try {
    const { data } = await axiosClient.get(
      `/api/event-bookings/${bookingId}/payment-status`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// Get order details from Revolut
export const getOrderDetails = async (orderId) => {
  try {
    const { data } = await axiosClient.get(
      `/api/event-bookings/order/${orderId}`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

// Cancel event booking
export const cancelEventBooking = async (id, cancelReason) => {
  try {
    const { data } = await axiosClient.patch(
      `/api/event-bookings/${id}/cancel`,
      { cancelReason },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
