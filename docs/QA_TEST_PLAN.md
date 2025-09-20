# QA Test Plan — Digital Booking

Objetivo: cubrir HU 1–35 con pruebas manuales y automáticas (frontend E2E + backend API tests).

## 1. Estrategia

- **Niveles**:
  - **Unit (backend)**: servicios (auth, booking, product) con Mockito/JPA.
  - **Integration (backend)**: SpringBootTest + H2; endpoints críticos: `/auth/*`, `/products/search`, `/bookings`.
  - **E2E (frontend)**: Playwright o Cypress; flujos: login, búsqueda, detalle, reserva, favoritos, perfil, admin básico.
- **Datos**:
  - Seed QA activable: `app.seed.qa=true` (ver README).
  - Cuentas demo: admin, qa admin y qa user.
- **Ambientes**:
  - Dev local (Docker Compose) + Mailpit.
  - CI opcional con GH Actions (build + tests headless).

## 2. Casos esenciales (resumen)

### Autenticación
- **Login OK**: email válido + pass válido → avatar con iniciales y menú.  
- **Login KO**: credenciales inválidas → mensaje “Unauthorized”.  
- **Logout**: pierde acceso a rutas privadas.

### Home / Búsqueda
- **Random 10**: al cargar Home, exactamente 10 cards, no repetidas.  
- **Search**: set city + rango fechas + categoría → resultados coherentes; categorías/recomendaciones permanecen.  
- **Reset**: limpia filtros y resultados.

### Producto (Detalle)
- **Header + back**: visibles y alineados.  
- **Galería**: 1 principal + 4 secundarias; “Ver más” muestra todas.  
- **Características**: lista con íconos.

### Reservas
- **Guard de login**: botón “Reserve” sin sesión → redirige a login (con mensaje).  
- **Disponibilidad**: calendario bloquea fechas ocupadas.  
- **Crear reserva**: confirmación OK + success page.  
- **Historial**: aparece en “My bookings”.

### Favoritos
- **Toggle**: Add/Remove en Home y en Favorites sincronizan.  
- **Persistencia**: reload y mantener estado.

### Admin
- **Acceso por rol**: `/administración` visible solo a admin.  
- **Productos**: listar/paginar/crear/eliminar; nombre único.  
- **Categorías**: crear/eliminar con confirmación.  
- **Características**: CRUD + asociación a producto.  
- **Usuarios**: grant/revoke admin.

### Notificaciones / Políticas / WhatsApp
- **Correo registro** (opcional): llega a Mailpit.  
- **Correo reserva**: llega con producto + rango + contacto.  
- **Políticas**: ruta accesible desde navegación.  
- **WhatsApp**: FAB abre `wa.me`; error si falta número.

## 3. Automatización (propuesta mínima)

### Frontend (Playwright)
- **Specs**:  
  - `auth.spec.ts`: login/logout (incluye race fix).  
  - `search.spec.ts`: combinar filtros y validar cards.  
  - `booking.spec.ts`: reservar y verificar en “My bookings”.  
  - `favorites.spec.ts`: add/remove y persistencia.  
  - `admin.spec.ts`: crear producto, validar en Home, eliminar.  
- **CI**: headless Chromium; baseURL `http://localhost:5173`.

### Backend (JUnit)
- **Unit**: `ProductServiceTest`, `BookingServiceTest`, `AuthServiceTest`.  
- **Integration**: `AuthControllerIT`, `ProductControllerIT`, `BookingControllerIT` con H2 y `@Sql` seeds.

## 4. Criterios de aceptación QA

- 0 **bloqueantes** abiertos.  
- 0 **críticos** abiertos.  
- Cobertura mínima unit **≥60%** en servicios booking y auth.  
- E2E “golden path” verde: login → search → detail → booking → email → history.

## 5. Evidencia

- Capturas: Home, Detail, Booking, Profile, Admin, Policies, Favorites, WhatsApp.  
- Logs: Mailpit (reserva) y `/actuator/health`/`info` OK.

