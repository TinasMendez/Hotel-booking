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
cp .env.example .env   # edit DB_/JWT_ values before booting services
docker compose up -d
```

This brings up MySQL 8, Mailpit, the Spring Boot API and the Vite frontend. Mailpit’s web UI lives at http://localhost:8025.

---

## 3. Backend (Spring Boot)

### 3.1 Environment variables (application.properties uses placeholders)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mysql://localhost:3306/reservasdb?useSSL=false&serverTimezone=UTC` | JDBC URL when running locally |
| `DB_USERNAME` | `app_user` | Database user (see `.env.example`) |
| `DB_PASSWORD` | *(required)* | Database password for `DB_USERNAME` |
| `JWT_SECRET` | *(required)* | HS256 signing key (≥ 32 ASCII chars) |
| `MAIL_HOST` | `localhost` | SMTP host (Mailpit by default) |
| `MAIL_PORT` | `1025` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | SMTP user if auth required |
| `MAIL_PASSWORD` | *(empty)* | SMTP password if auth required |
| `MAIL_SMTP_AUTH` | `false` | Toggle SMTP auth |
| `MAIL_SMTP_STARTTLS` | `false` | Toggle STARTTLS |
| `MAIL_FROM` | `noreply@digitalbooking.local` | Sender address for transactional emails |
| `MAIL_SUPPORT` | `reservas@digitalbooking.local` | Support contact shown in emails |
| `FRONTEND_BASE_URL` | `http://localhost:5173` | Used in booking confirmation emails |
| `SUPPORT_PHONE` | *(empty)* | Optional phone number shown in emails |
| `SUPPORT_WHATSAPP_URL` | *(empty)* | Optional WhatsApp deeplink |
| `UPLOADS_BASE_DIR` | `./storage/uploads` | Filesystem root for uploaded images |
| `UPLOADS_MAX_FILES_PER_DIR` | `500` | Safety cap per upload directory (0 = no limit) |
| `UPLOADS_MAX_FILE_SIZE` | `5242880` | Max image size in bytes (default 5 MB) |
| `SPRINGDOC_API_DOCS` | `true` | Enables `/v3/api-docs` + Swagger UI |
| `MANAGEMENT_INFO_ENABLED` | `false` | Expose `/actuator/info` in non-dev environments |

> ℹ️  Copy `.env.example` to `.env` and adjust secrets before running the stack locally.

### 3.2 Useful commands

```bash
# Build without running tests
mvn clean package -DskipTests

# Run the API
mvn spring-boot:run
```

Running `mvn clean package` (or any build that executes the `build-info` goal) refreshes the metadata returned by `/actuator/info`.

### 3.3 Observabilidad (Actuator)

- **Dev profile**: `/actuator/health` y `/actuator/info` están abiertos. `curl http://localhost:8080/actuator/info` devuelve versión y timestamp del build.
- **Prod profile**: sólo se expone `/actuator/health`. Para consultar `/actuator/info` se requiere un usuario con `ROLE_ADMIN` y la propiedad `MANAGEMENT_INFO_ENABLED=true`.
- Variable opcional `ACTUATOR_INFO_PUBLIC=true` permite habilitar `/actuator/info` sin autenticación (ya incluida por defecto en `application-dev`).

### 3.4 QA seed data

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
