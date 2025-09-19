# Hotel Reservation Backend (Spring Boot 3.5.5, Java 21)

Backend for a hotel reservation platform using **Spring Boot**, **JPA/Hibernate**, **JWT Security**, and **MySQL** (dev) / **H2** (tests).  
This project intentionally avoids Lombok — all constructors/getters/setters are **manual**.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Development)](#quick-start-development)
- [Environments & Profiles](#environments--profiles)
- [Database & Seed Data](#database--seed-data)
- [Security (JWT)](#security-jwt)
- [API Docs (Swagger)](#api-docs-swagger)
- [Postman Collection](#postman-collection)
- [Build & Test](#build--test)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Overview
- **Domain**: Products (hotels/rooms), Categories, Cities, Features, Bookings, Users & Roles, Customers, Policies, Reviews, Favorites.
- **Relationships**:  
  - `Product` -> `Category` (ManyToOne)  
  - `Product` -> `City` (ManyToOne)  
  - `Product` <-> `Feature` (ManyToMany)  
- **Bookings**: use `productId`, `customerId`, `startDate`, `endDate`, and `BookingStatus` enum.  
- **Security**: JWT-based auth with `SecurityFilterChain`, `JwtAuthenticationFilter`, and `CustomUserDetailsService`.  
- **Documentation**: Stable Swagger UI served from `/docs.html` (static `openapi.yaml`).  

---

## Tech Stack
- Java 21, Spring Boot 3.5.5
- Spring Web, Spring Security, Spring Data JPA
- MySQL (dev), H2 (tests)
- JJWT 0.11.5
- Springdoc OpenAPI (Swagger UI) with static spec

---

## Prerequisites
- Java 21
- Maven 3.9+ (or use the Wrapper `./mvnw`)
- MySQL running locally

**Dev profile excerpt (`application-dev.properties`):**
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/reservasdb?useSSL=false&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
jwt.secret=${JWT_SECRET:change-me-in-dev-32bytes-secret-key!!}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

Export your credentials (or rely on `.env`) before running the app, for example:

```bash
export DB_URL=jdbc:mysql://localhost:3306/reservasdb?useSSL=false&serverTimezone=UTC
export DB_USERNAME=root
export DB_PASSWORD=
export JWT_SECRET=please-change-this-64-byte-secret-key-1234567890abcdef
```

También puedes copiar el archivo de ejemplo provisto en la raíz del proyecto:

```bash
cp ../.env.example ../.env
# edita ../.env con tus valores reales antes de iniciar backend o docker-compose
```

> Nota: evita usar el usuario `root` en entornos compartidos. Crea una cuenta dedicada si es posible y sólo otórgale permisos sobre `reservasdb`.

---

## Quick Start (Development)
```bash
# 1. Clone repository
git clone https://github.com/your-org/hotel-reservations-backend.git
cd hotel-reservations-backend/backend

# 2. Build project
mvn clean package -DskipTests

# 3. Run Spring Boot
mvn spring-boot:run
```

> Tip: el goal `build-info` se ejecuta junto al build y alimenta `/actuator/info` con versión y timestamp.

## Observabilidad (Actuator)
- Perfil `dev`: `/actuator/health` y `/actuator/info` están abiertos.
- Perfil `prod`: sólo `/actuator/health` está expuesto; `/actuator/info` exige `ROLE_ADMIN` y puede abrirse con `ACTUATOR_INFO_PUBLIC=true`.
- Para habilitar `/actuator/info` sin autenticación en otros entornos, exporta `ACTUATOR_INFO_PUBLIC=true`.

---

## Environments & Profiles
- **default** → local dev, connects to MySQL.  
- **test** → uses H2 in-memory DB for unit/integration tests.  
- **dev** → optional, loads `SampleDataLoader` for seed data.  

---

## Database & Seed Data
- Main DB: `reservasdb` (MySQL).  
- Entities: Products, Categories, Cities, Features, Bookings, Users, Roles, Policies, Favorites, Reviews.  
- `SampleDataLoader` seeds data automatically when `spring.profiles.active=dev`.  

---

## Security (JWT)
- Endpoints `/api/auth/register` and `/api/auth/login` are public.  
- Authenticated users receive a JWT.  
- Use JWT in `Authorization: Bearer <token>` for protected endpoints.  
- Admin endpoints require `ROLE_ADMIN`.  

---

## API Docs (Swagger)
- **Docs UI**: [http://localhost:8080/docs.html](http://localhost:8080/docs.html)  
- **Spec file**: [http://localhost:8080/openapi.yaml](http://localhost:8080/openapi.yaml)  

> Note: Springdoc’s dynamic generator (`/v3/api-docs`) was disabled due to stability issues.  
> Instead, we serve a **static `openapi.yaml`** + Swagger UI (`docs.html`) for reliable documentation.  

---

## Postman Collection
A Postman environment and collection are included (`/postman/`) to test endpoints.  
- Import collection → authenticate via `/api/auth/login` → copy token → set `Authorization` header.  

---

## Build & Test
```bash
# Run all tests
mvn test

# Build without tests
mvn clean package -DskipTests
```

---

## Project Structure
```
backend/
 ├── src/main/java/com/miapp/reservashotel
 │   ├── config/           # SecurityConfig, WebConfig, OpenApiConfig
 │   ├── controller/       # REST controllers
 │   ├── dto/              # DTOs (Request/Response)
 │   ├── model/            # Entities (Category, Product, Booking, etc.)
 │   ├── repository/       # Spring Data JPA repositories
 │   ├── security/         # JWT filters, JwtUtil
 │   ├── service/          # Interfaces
 │   └── service/impl/     # Service implementations
 ├── src/main/resources
 │   ├── application.properties
 │   ├── static/
 │   │   ├── docs.html     # Swagger UI page
 │   │   └── openapi.yaml  # Static API spec
 │   └── schema.sql / data.sql (optional seed)
 └── pom.xml
```

---

## Troubleshooting
- **Port 8080 already in use**  
  ```bash
  lsof -t -iTCP:8080 -sTCP:LISTEN | xargs -r kill -9
  ```
- **Swagger not loading** → use [http://localhost:8080/docs.html](http://localhost:8080/docs.html).  
- **JWT 403 errors** → ensure you’re passing `Authorization: Bearer <token>` header.  

---

### Demo Seed
Run a one-time demo seed (idempotent):

- `POST http://localhost:8080/api/admin/seed`

It creates:
- 2 Categories, 2 Cities, 5 Features
- 2 Products (Bogotá/Medellín) with features & prices
- 2 Bookings for `demo.user@acme.com`

### Tests (H2)
```bash
mvn -Dspring.profiles.active=test -Dtest=*Booking* test
