import { api } from "./api";

export async function checkAvailability(a, b, c) {
  let productId, startDate, endDate;
  if (typeof a === "object" && a !== null) {
    productId = a.productId ?? a.id ?? a.product_id;
    startDate = a.startDate ?? a.start ?? a.from;
    endDate = a.endDate ?? a.end ?? a.to;
  } else {
    productId = a; startDate = b; endDate = c;
  }
  const params = { productId, start: startDate, end: endDate };
  const { data } = await api.get("/api/bookings/availability", { params });
  return data;
}

export async function createBooking({ productId, startDate, endDate }) {
  const payload = { productId, startDate, endDate };
  const { data } = await api.post("/api/bookings", payload);
  return data;
}

export async function cancelBooking(bookingId) {
  const { data } = await api.delete(`/api/bookings/${bookingId}`);
  return data;
}

export async function getMyBookings() {
  const { data } = await api.get(`/api/bookings/me`);
  return data;
}
