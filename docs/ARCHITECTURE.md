# Architecture Overview

## Stack
- **Frontend:** React 18 + Vite, React Router.
- **Backend:** Spring Boot 3 (Java 21), Spring Data JPA, JWT.
- **DB:** MySQL 8 (`reservasdb`).
- **Dev Email:** Mailpit (SMTP sink) via docker-compose.
- **Infra (local):** Docker for Mailpit; npm/Maven scripts.

## Layers (backend)
- **Controller** → REST endpoints (`/api/**`).
- **Service** → business rules (roles, availability, booking rules).
- **Repository** → JPA repositories (CategoryRepository, ProductRepository, BookingRepository…).
- **Security** → JWT filter + role-based access (USER/ADMIN).
- **Exception** → `GlobalExceptionHandler` → `ApiError` JSON.

## Key Entities
- **User** (id, firstName, lastName, email, passwordHash, roles)
- **Category** (id, name, description, imageUrl)
- **Feature** (id, name, icon)
- **City** (id, name, country)
- **Product** (id, name, description, images[], price, city -> City, category -> Category, features M:N)
- **Booking** (id, user -> User, product -> Product, startDate, endDate, status)
- **Rating** (id, user -> User, product -> Product, stars 1..5, comment?, createdAt)

## Availability logic (simplified)
- Blocked dates = union of existing `CONFIRMED` bookings for the product.
- UI disables blocked days; API rejects overlaps (409).

## Email
- After booking success → HTML email to user (sender `noreply@digitalbooking.local`) via Mailpit UI at `http://localhost:8025`.

## WhatsApp
- Floating button → deeplink `https://api.whatsapp.com/send?phone=<E164>&text=<msg>`.

## Error Model
```json
{
  "timestamp": "2025-09-23T21:45:10.123Z",
  "status": 409,
  "error": "Conflict",
  "message": "Category with id 9 cannot be deleted because it has related products (3)",
  "path": "/api/categories/9"
}
