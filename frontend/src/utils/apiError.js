export function normalizeApiError(error, fallbackMessage = "") {
  if (!error) {
    return {
      code: "UNKNOWN",
      message: fallbackMessage,
      status: 0,
      details: null,
    };
  }

  const response = error.response;
  const payload = response?.data;
  const status = response?.status ?? 0;
  if (payload && typeof payload === "object") {
    const { code, message, details } = payload;
    return {
      code: code || (status ? `HTTP_${status}` : "UNKNOWN"),
      message: message || fallbackMessage || error.message || "",
      status,
      details: details ?? null,
    };
  }

  return {
    code: status ? `HTTP_${status}` : "UNKNOWN",
    message: fallbackMessage || error.message || "",
    status,
    details: null,
  };
}

export function getApiErrorMessage(
  normalizedError,
  formatMessage,
  fallbackMessage = "",
) {
  if (!normalizedError) return fallbackMessage;
  const { code, message } = normalizedError;

  const keyMap = {
    BOOKING_DATES_UNAVAILABLE: "errors.booking.datesUnavailable",
    PRODUCT_NAME_DUPLICATE: "errors.product.duplicate",
    FORBIDDEN: "errors.forbidden",
    UNAUTHORIZED: "auth.sessionExpired",
    VALIDATION_ERROR: "errors.validation",
    RATING_DUPLICATE: "errors.rating.duplicate",
    RATING_NOT_ALLOWED: "errors.rating.notAllowed",
    CATEGORY_IN_USE: "errors.category.inUse",
    PRODUCT_HAS_BOOKINGS: "errors.product.inUse",
  };

  const translationKey = keyMap[code];
  if (translationKey && typeof formatMessage === "function") {
    return formatMessage({ id: translationKey });
  }

  if (message) {
    return message;
  }

  if (typeof formatMessage === "function") {
    return formatMessage({ id: "errors.generic" });
  }

  return fallbackMessage || "";
}
