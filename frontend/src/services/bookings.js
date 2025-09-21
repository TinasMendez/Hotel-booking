import api from "./api";

/**
 * Booking API wrapper.
 * Creates a booking and fetches product details for the booking page.
 */
export async function fetchProductById(id) {
  const { data } = await api.get(`/api/v1/products/${id}`);
  return data;
}

export async function createBooking({ productId, startDate, endDate }) {
  // Adjust payload keys if your backend expects different names
  const { data } = await api.post("/api/v1/bookings", {
    productId,
    startDate,
    endDate,
  });
  return data;
}
