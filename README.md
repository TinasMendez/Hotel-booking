# Digital Booking Monorepo

> **Espanol:** If you prefer a Spanish quick guide and evidence map, see **[README.es.md](./README.es.md)** and **[docs/ENTREGA_ES.md](./docs/ENTREGA_ES.md)**.

Full-stack booking platform built with **Spring Boot (Java 21)** and **React + Vite**. This README keeps setup simple: quick start, demo accounts, a 5-minute smoke test, and links to the rest of the docs.

---

## 1) Requirements

| Tool | Version |
|------|---------|
| Java | 21 (LTS) |
| Spring Boot | 3.x |
| Maven | >= 3.9 |
| Node.js | >= 18.x |
| npm | >= 9.x |
| MySQL | >= 8.0 |
| Vite | 5.x |

Optional for local QA:
- **Docker** (to run Mailpit or DB quickly)
- **Mailpit** (SMTP testing web UI at http://localhost:8025)

---

## 2) Quick start

### Option A - Docker Compose (Mailpit only)
```bash
# Bring up Mailpit for dev emails (see docker-compose.yml)
docker compose up -d mailpit
# Mail UI -> http://localhost:8025
```

### Option B - Manual (DB + API + Web)
```bash
# 1) Database (local MySQL 8)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS reservasdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2) Backend (Spring Boot API)
cd backend
mvn spring-boot:run   # http://localhost:8080

# 3) Frontend (React + Vite)
cd ../frontend
npm install
npm run dev           # http://localhost:5173
```

Default local configuration (already in the project):
- **DB URL:** `jdbc:mysql://localhost:3306/reservasdb`
- **DB user/pass:** `root` / `Tina050898`
- **JWT:** HS256 secret set in `application.properties`
- **Mailpit (dev):** http://localhost:8025

---

## 3) Demo accounts

Use these for quick validation:

- **Admin:** `vale@example.com` / `Test1234!`
- **User:** `juan@example.com` / `Juan1234!`

> You can also register a new user at any time.

---

## 4) 5-minute smoke test

1. Open **Home** -> search box, categories, recommendations render.
2. **Login** with the Admin account above.
3. Open a **product detail**, select a valid date range, and **Reserve** -> see success screen.
4. Go to **My bookings** -> verify the new reservation.
5. Open **Mailpit** (`http://localhost:8025`) -> booking confirmation email appears.
6. Click the floating **WhatsApp** button -> deeplink opens.
7. Visit the **Admin panel** (desktop) -> categories/products/features.
   - Delete a **category without products** -> HTTP **204**.
   - Try to delete a **category with products** -> HTTP **409**.

---

## 5) Postman

The collection/environment are in `docs/postman/`. Typical flow:

1. Import **DigitalBooking.postman_environment.json** and **DigitalBooking.postman_collection.json**.
2. Select the **Digital Booking Local Environment**.
3. Run **POST Login** with the admin credentials - the script stores the JWT in `{{token}}`.
4. Call protected endpoints (Products/Categories/Bookings).

> See **[docs/postman/README.md](docs/postman/README.md)** and **[docs/API_QUICKSTART.md](docs/API_QUICKSTART.md)** for details.

---

## 6) Observability (Actuator)

- **Dev:** `/actuator/health` and `/actuator/info` are open.  
  `curl http://localhost:8080/actuator/info` returns build version & timestamp.
- **Prod:** only `/actuator/health` is public (unless explicitly configured).

---

## 7) Useful commands

Backend:
```bash
mvn clean package -DskipTests
mvn spring-boot:run
```

Frontend:
```bash
npm run dev
npm run build
```

---

## 8) Documentation

- Architecture: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**
- API Quickstart: **[docs/API_QUICKSTART.md](docs/API_QUICKSTART.md)**
- Postman guide: **[docs/postman/README.md](docs/postman/README.md)**
- QA plan: **[docs/tests/plan.md](docs/tests/plan.md)**
- QA checklist: **[docs/verification/QA_CHECKLIST.md](docs/verification/QA_CHECKLIST.md)**
- Evidence index: **[docs/evidence/INDEX.md](docs/evidence/INDEX.md)**
