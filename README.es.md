# Digital Booking — Documentacion en Espanol

> **Nota:** La aplicacion (frontend/backend) y la documentacion tecnica estan en **ingles** por estandares del sector.  
> Este archivo ofrece un **resumen en espanol** y una guia rapida para ejecutar y evaluar.

## Resumen
Plataforma de **reservas** (hoteles). **Spring Boot + MySQL** en backend y **React + Vite** en frontend.  
Cumple Sprints 1-4: estructura, autenticacion/roles, categorias/funcionalidades, busqueda y disponibilidad, favoritos, politicas, compartir, **reservas end-to-end**, **historial**, **WhatsApp** y **correo** de confirmacion.

## Requisitos y puertos
- **Backend:** `http://localhost:8080`
- **Frontend:** `http://localhost:5173`
- **Mailpit:** `http://localhost:8025`
- **MySQL 8 – DB:** `reservasdb` (user `root`, pass `Tina050898`)

## Como correr
```bash
# 1) Base de datos (si aun no existe)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS reservasdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2) Backend
cd backend
mvn spring-boot:run

# 3) Mailpit (opcional recomendado)
docker compose up -d mailpit   # luego abrir http://localhost:8025

# 4) Frontend
cd ../frontend
npm install
npm run dev   # abre http://localhost:5173
```

## Usuarios demo
- **Admin:** `vale@example.com` / `Test1234!`  
- **User:** `juan@example.com` / `Juan1234!`

> Puedes registrarte con un nuevo email si lo prefieres.

## Prueba rapida
1. Abrir **Home** -> ver buscador, categorias y recomendaciones.  
2. **Login** (o registro).  
3. Entrar a un **detalle de producto**, elegir rango de fechas y **Reservar** -> ver **Success**.  
4. Ir a **My bookings** -> verificar el estado.  
5. Abrir **Mailpit** (`http://localhost:8025`) -> confirmar **email** recibido.  
6. Probar el boton flotante de **WhatsApp** (abre deeplink).  
7. En desktop, ir al **Admin panel** -> categorias/productos/features;  
   - eliminar **categoria sin productos** -> **204**  
   - eliminar **categoria con productos** -> **409**

## Evidencias y pruebas
- **Indice:** `docs/evidence/INDEX.md`  
- **Plan de pruebas:** `docs/tests/plan.md`  
- **Checklist QA:** `docs/verification/QA_CHECKLIST.md`  
- **Postman:** `docs/postman/`

## Tecnologias
Spring Boot 3, Java 21, Spring Data JPA, JWT, React 18 + Vite, MySQL 8, Mailpit (SMTP dev).

## Nota al jurado
La UI esta en ingles por estandarizacion; esta guia en espanol resume ejecucion y evaluacion.
