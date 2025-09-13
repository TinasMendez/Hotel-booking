# CHANGELOG

## Sprint 1 – Core Setup & CRUD Basics
- **Project setup**: Spring Boot 3.5.5, Java 21, Maven.
- **Database**: MySQL (dev) + H2 (tests), JPA/Hibernate.
- **Entities & CRUD**:  
  - Category  
  - City  
  - Product  
- **Repositories, Services, Controllers** for each entity.  
- **DTOs** with validations using `jakarta.validation`.  
- **Tests**: Basic integration with H2.  
- **Swagger/OpenAPI** integrated (`/docs.html`).

---

## Sprint 2 – Features & Authentication
- **Feature entity** + assignment to Products (`ManyToMany`).  
- **Advanced product search** by category, city, feature, price range, keyword.  
- **Global exception handling** (`ResourceNotFoundException`).  
- **Authentication**: JWT implemented (register, login, token validation).  
  - `User`, `Role` entities.  
  - `AuthController`, `JwtService`, `SecurityConfig`.  
- **Validation layer**: DTOs with constraints, error messages.  
- **Swagger** configured with public and secured endpoints.

---

## Sprint 3 – Bookings
- **Booking entity**:  
  - Fields: `id`, `productId`, `customerId`, `startDate`, `endDate`, `BookingStatus`.  
- **DTOs**: `BookingRequestDTO`, `BookingResponseDTO`.  
- **Service + Impl**:  
  - Create, update, delete, list bookings.  
  - Check overlapping dates to avoid double booking.  
  - Filtering by customer, status, date range.  
  - Get most booked products.  
- **Controller**: REST endpoints for all booking operations.  
- **Security**: Bookings protected, only logged-in users allowed.

---

## Sprint 4 – Frontend Integration (In Progress)
- **Frontend scaffolding**: React + Vite + Tailwind.  
- **Environment config**: `.env` with `VITE_API_BASE_URL=http://localhost:8080`.  
- **Backend CORS**: Fixed duplicate config (`WebConfig` only).  
- **Security beans cleanup**: Removed duplicate `AuthenticationManager` bean, added `PasswordEncoder`.  
- **Connection test**: Frontend running on `http://localhost:5174/` with backend API reachable.

---

✅ Up to this point, backend is fully functional, tested against MySQL, and frontend is successfully scaffolded and connected.  
**Next step**: build frontend pages/components and integrate API calls with Axios + auth guard.
