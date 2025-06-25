import { axiosClient } from '../AxiosClient/axios';

// Create event booking payment session
export const createEventBookingPaymentSession = async (bookingData) => {
  try {
    const { data } = await axiosClient.post(
      '/api/event-bookings/payment-session',
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

// Create event booking
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

// Get user's event bookings
export const getUserEventBookings = async () => {
  try {
    const { data } = await axiosClient.get('/api/event-bookings/user', {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// Cancel event booking
export const cancelEventBooking = async (id) => {
  try {
    const { data } = await axiosClient.patch(
      `/api/event-bookings/${id}/cancel`,
      {},
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
