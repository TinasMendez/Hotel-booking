import Api, { BookingAPI } from "/src/services/api.js";

export async function checkAvailability(a, b, c) {
  let productId, startDate, endDate;
  if (typeof a === "object" && a !== null) {
    productId = a.productId ?? a.id ?? a.product_id;
    startDate = a.startDate ?? a.start ?? a.from;
    endDate = a.endDate ?? a.end ?? a.to;
  } else {
    productId = a; startDate = b; endDate = c;
  }
  return BookingAPI.checkAvailability({ productId, startDate, endDate });
}

export async function createBooking({ productId, startDate, endDate }) {
  const payload = { productId, startDate, endDate };
  return BookingAPI.createBooking(payload);
}

export async function cancelBooking(bookingId) {
  return BookingAPI.cancelBooking(bookingId);
}

export async function getMyBookings() {
  return BookingAPI.listMine();
}
