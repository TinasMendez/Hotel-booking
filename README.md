# Digital Booking Monorepo

Full-stack booking platform built with Spring Boot (Java 21) and React + Vite. This README covers prerequisites, environment variables, startup commands and the recommended 5 minute smoke test.

---

## 1. Requirements

| Tool | Version |
|------|---------|
| Java | 21 (LTS) |
| Spring Boot | 3.5.3 |
| Maven | ≥ 3.9 |
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MySQL | ≥ 8.0 |
| Vite | 5.x |

Optional utilities for local QA:
- Docker (for quick MySQL & Mailpit containers)
- Mailpit (SMTP testing web UI)

---

## 2. Quick infrastructure setup (Docker)

```bash
# MySQL
docker run --name reservas-mysql \
  -e MYSQL_ROOT_PASSWORD=Tina050898 \
  -e MYSQL_DATABASE=reservasdb \
  -p 3306:3306 \
  -d mysql:8.0

# Mailpit (SMTP + Web UI)
docker run --name mailpit \
  -p 1025:1025 -p 8025:8025 \
  -d axllent/mailpit
```

Mailpit UI is available at http://localhost:8025.

---

## 3. Backend (Spring Boot)

### 3.1 Environment variables (application.properties uses placeholders)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mysql://localhost:3306/reservasdb` | MySQL connection URL |
| `DB_USERNAME` | `root` | DB user |
| `DB_PASSWORD` | `password` | DB password |
| `MAIL_HOST` | `localhost` | SMTP host (Mailpit) |
| `MAIL_PORT` | `1025` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | SMTP user (if required) |
| `MAIL_PASSWORD` | *(empty)* | SMTP password |
| `MAIL_SMTP_AUTH` | `false` | SMTP auth flag |
| `MAIL_SMTP_STARTTLS` | `false` | STARTTLS flag |
| `MAIL_FROM` | `noreply@digitalbooking.local` | Sender address |
| `MAIL_SUPPORT` | `reservas@digitalbooking.local` | Support contact shown in emails |
| `FRONTEND_BASE_URL` | `http://localhost:5173` | Used in booking confirmation emails |
| `SUPPORT_PHONE` | *(empty)* | Optional phone for emails |
| `SUPPORT_WHATSAPP_URL` | *(empty)* | Optional WhatsApp link for emails |
| `app.seed.qa` | *(off)* | Set to `true` to load demo data at boot |

### 3.2 Useful commands

```bash
# Build without running tests
mvn clean package -DskipTests

# Run the API
mvn spring-boot:run
```

Actuator endpoints (enabled by default):
- Health check: `GET http://localhost:8080/actuator/health`
- Info: `GET http://localhost:8080/actuator/info`

### 3.3 QA seed data

Launch the application with `app.seed.qa=true` to preload cities, categories, products (with gallery & policies), bookings and demo users.

Demo accounts include:
- **Admin:** `admin@admin.com` / `Admin123*`
- **QA Admin:** `vale@example.com` / `Test1234!`
- **QA User:** `vsernamendez@gmail.com` / `Nina1234!`

---

## 4. Frontend (React + Vite)

### 4.1 Environment variables (`frontend/.env.example`)

```
VITE_API_BASE=http://localhost:8080/api
VITE_WHATSAPP_NUMBER=573000000000
VITE_WHATSAPP_MESSAGE=Hi! I would like to know more about this property.
```

### 4.2 Commands

```bash
npm install
npm run dev    # development server (http://localhost:5173)
npm run build  # production build
```

---

## 5. Five-minute smoke test

1. **Infra**
   - MySQL running with the credentials above.
   - Mailpit running (http://localhost:8025).

2. **Backend up**
   - `mvn spring-boot:run`
   - Check `GET http://localhost:8080/actuator/health` returns `{"status":"UP"}`.

3. **API sanity**
   - `GET http://localhost:8080/api/products` returns 200.
   - Register a user `POST /api/auth/register` → 201.
   - Login `POST /api/auth/login` → 200 (copy JWT if you want to test raw endpoints).

4. **Frontend**
   - `npm run dev`, open http://localhost:5173.
   - Login with `vsernamendez@gmail.com / Nina1234!`.
   - Explore Home (autosuggest + calendar), view product detail, use “Share”.

5. **Reservation flow**
   - From a product detail, choose a valid range, click “Reserve”, confirm booking.
   - Check Mailpit inbox → booking confirmation email (HTML template).
   - Visit “My bookings” to verify the new reservation; cancel it to ensure the status updates.

6. **Admin checks**
   - Login as `vale@example.com / Test1234!` (ROLE_ADMIN).
   - Access `/administración` → admin dashboard.
   - Create a category/product; verify they appear in Home.

7. **Policies & Profile**
   - Ensure the “Policies” page is reachable from header/footer.
   - Open “My profile” from the avatar menu and confirm user details are correct.

---

## 6. Notas y recomendaciones

- El proyecto evita Lombok; todas las entidades/DTO tienen getters/setters manuales.
- JWT está configurado con roles (`Role` entity + `@ManyToMany`). Usar `Authorization: Bearer <token>` para endpoints protegidos.
- El filtro JWT vive en `backend/src/main/java/com/miapp/reservashotel/security/JwtAuthenticationFilter.java`.
- Para producción, rotar claves, configurar un SMTP real y mover cualquier secreto a variables de entorno seguras.
- Si se emplea una base en memoria para tests, hacerlo vía perfiles (e.g., `application-test.properties`).

---

## 7. Comandos útiles

Backend:
```bash
mvn clean package -DskipTests
mvn spring-boot:run
```

Frontend:
```bash
npm run build
npm run dev
```

---

¡Lista la guía! Levantar MySQL + Mailpit, correr backend y frontend y realizar el smoke test dejará ver todas las historias implementadas (reservas, favoritos, ratings, políticas, botón WhatsApp, etc.).
