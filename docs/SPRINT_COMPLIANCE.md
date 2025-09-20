# Sprint Compliance — Digital Booking

Estado de cumplimiento por Historia de Usuario (HU). Escala: **Done / Partial / Missing / Verify**.

> Nota: los estados “Verify” incluyen pasos de validación manual a ejecutar en el smoke test final.

---

## Sprint 1 — Meta y User Stories

**Meta:** Estructura básica + registro, visualización y eliminación de productos.

| HU | Título | Estado | Evidencia / Notas | Cómo verificar (rápido) |
|---|---|---|---|---|
| 1 | Header | **Done** | Header 100% ancho, sticky, logo+lema, botones “Create account” y “Sign in”. Responsive. | Resize a mobile/desktop, scroll: header fijo. Click logo → `/`. |
| 2 | Main (Home) | **Done** | 3 bloques visibles: buscador, categorías, recomendaciones. Main 100% alto, responsive. | Home: ver 3 bloques. Lighthouse mobile ≥90 layout. |
| 3 | Registrar producto | **Verify** | CRUD de producto en panel admin; validación nombre único en backend. | Admin `/administración` → “Add product”. Guardar. Duplicar nombre → 409/validation error. |
| 4 | Visualizar productos en home | **Done** | “Recommendations”: **máx 10**, únicos, 2 columnas x 5 filas. Aleatoriedad server-side/endpoint `/products/random?limit=10`. | Refrescar “Refresh” varias veces: sin repetidos en una tanda, orden no predecible. |
| 5 | Detalle de producto | **Verify** | Header 100%; título izquierda; flecha back derecha; body con descripción + imágenes. | Abrir `/product/:id`. Revisar layout + galería. |
| 6 | Galería de imágenes | **Verify** | Bloque full-width; 5 imágenes: principal izquierda 50%, derecha grilla 2x2; “Ver más” a todas las imágenes. Responsive. | Desktop: layout 1+4 correcto. Mobile: colapsa a lista/slider. |
| 7 | Footer | **Done** | 100% ancho, visible en todas las páginas; isologotipo, año y copyright; responsive. | Cambiar de ruta: footer presente; año actual. |
| 8 | Paginación productos | **Verify** | Listado paginado ≤10 por página (en admin/lista). | En “List of products” ver paginador (prev/next/first). |
| 9 | Panel de administración | **Verify** | `/administración` con menú de funciones. No responsive; en móvil: mensaje “no disponible”. | Simular width < 768px → mostrar aviso. |
| 10 | Listar productos | **Done** | Página con tabla Id/Name/Actions. | Navegar a “List of products” en admin. |
| 11 | Eliminar producto | **Done** | Acción “Eliminar”, confirmación, elimina en BD, cancela sin cambios. | Eliminar un ítem de prueba y confirmar en BD/listado. |

**Entregables Sprint 1:**  
- Documentación/Bitácora **Done** (README + docs presentes).  
- Identidad de marca **Verify** (logo + paleta en UI).  
- Planificación y ejecución de tests **Partial** (este doc aporta plan; faltan tests ejecutables).  
- Repo público actualizado **Done**.

---

## Sprint 2 — Meta y User Stories

**Meta:** Login/registro y detalle de producto.

| HU | Título | Estado | Evidencia / Notas | Cómo verificar |
|---|---|---|---|---|
| 12 | Categorizar productos | **Verify** | Asignar categoría a existentes y nuevos desde Admin; DTO/endpoint soportan `categoryId`. | Editar producto → setear categoría → ver en Home/Detail. |
| 13 | Registrar usuario | **Done** | Form de registro con validaciones (nombre, apellido, email, contraseña). UX intuitiva. | `/register` → validar errores y submit OK. |
| 14 | Login | **Done** | Email+password → token; error claro si inválido. **Arreglado** doble click con set token previo a `/me`. | Intento fallido muestra toast/error; intento válido inicia. |
| 15 | Logout | **Done** | Opción “Sign out” bajo avatar; logout seguro; pierde acceso privado. | Logout y navegar a rutas restringidas: redirige a login. |
| 16 | Identificar administrador | **Verify** | Rol admin habilita secciones admin; opción de añadir/quitar permisos. | Con admin ver `/administración`; con user no. Probar grant/revoke vía admin panel. |
| 17 | Administrar características | **Verify** | Panel “Manage features”: listado editar/eliminar; añadir nombre+icono; asociar a producto en add/edit. | Crear feature, asociarla y verla en detalle. |
| 18 | Ver características en detalle | **Verify** | Bloque “Features” en detalle, lista con ícono; responsive. | `/product/:id` → sección presente. |
| 19 | Notificación confirmación registro (opcional) | **Partial** | Mailpit incluido; verificar email de bienvenida si implementado. No condiciona evaluación. | Registrar usuario y revisar Mailpit. |
| 20 | Sección de categorías | **Done** | Bloque con título + texto descriptivo. | Home → bloque “Categories”. |
| 21 | Agregar categoría | **Done** | Form con nombre, descripción, imagen; persiste. | Admin → “Add category” → aparece en lista. |

**Entregables Sprint 2:**  
- Documentación **Done** (README + este doc).  
- Plan tests Sprint **Partial** (falta automatización).  
- Repo público **Done**.

---

## Sprint 3 — Meta y User Stories

| HU | Título | Estado | Evidencia / Notas | Cómo verificar |
|---|---|---|---|---|
| 22 | Búsqueda | **Done** | Bloque con título/parágrafo; doble calendario rango; botón “Search”; resultados relevantes; autosuggest; mantiene categorías y recomendaciones visibles. | Buscar por fechas/ciudad/categoría; ver “Search results” + bloques. |
| 23 | Disponibilidad | **Verify** | En detalle, doble calendario con disponibles/ocupadas diferenciado; manejo de errores + Retry. | `/product/:id` → calendario; simular error API. |
| 24 | Favoritos | **Done** | Ícono/botón en cards del Home; autenticados togglean 1 clic; multi-dispositivo. | Add/remove en Home; ver “My favorites” actualizado. |
| 25 | Mi perfil | **Done** | Página perfil con datos (nombre/email/roles), segura y clara. | Avatar → “My profile”. |
| 26 | Políticas | **Done** | Página “Policies” desde navegación con términos y privacidad. | Footer/Header → “Policies”. |
| 27 | Redes: Compartir productos | **Verify** | Ventana de compartir: Facebook/Twitter/Instagram como mínimo; imagen, descripción breve, link. Mensaje personalizable; redirección correcta. | Botón “Share” en detalle → popup con opciones. **Nota:** Instagram no soporta web share nativo → usar copy-link/Intent móvil. |
| 28 | Puntuar producto | **Verify** | Solo usuarios con reserva; estrellas 1–5; reseña opcional; promedio en tiempo real y visible en detalle/resultados. | Completar reserva → calificar; ver promedio actualizado. |
| 29 | Eliminar categoría | **Verify** | Opción clara; confirmación con nombre/alerta y consecuencias. | Admin → eliminar y confirmar; impacto en productos. |

**Entregables Sprint 3:**  
- Documentación **Done** (este doc).  
- Plan tests **Partial** (faltan suites).  
- Repo público **Done**.

---

## Sprint 4 — Meta y User Stories

| HU | Título | Estado | Evidencia / Notas | Cómo verificar |
|---|---|---|---|---|
| 30 | Reservas — Seleccionar fecha | **Done** | Acceso desde detalle; verifica login; buscar disponibles por fecha; selección de rango guardada; bloquea fechas no disponibles. | Intentar reservar no logueado → redirige a login; luego reservar OK. |
| 31 | Reservas — Ver detalles | **Done** | Detalle incluye título, ubicación, imágenes, descripción, info destacada, user data y rango válido; botón confirmar. | Pantalla de reserva muestra todo y valida rango. |
| 32 | Realizar reserva | **Done** | Selección de producto + rango; registra; success page; errores específicos. | Reservar correctamente; forzar error y ver mensaje. |
| 33 | Historial | **Done** | “My bookings” lista reservas anteriores. | Navegar y verificar elementos. |
| 34 | WhatsApp | **Done** | FAB visible (inferior derecha), consistente en resoluciones; sin requerir registro; toast éxito/error; deeplink `wa.me`. | Configurar `VITE_WHATSAPP_NUMBER`; click abre nueva pestaña; error si falta. |
| 35 | Notificación reserva por correo | **Verify** | Tras reserva, correo automático con nombre de producto, fecha/hora y contacto; llega en <24h (instantáneo en dev vía Mailpit). | Completar reserva; validar en Mailpit. |

**Entregables Sprint 4:**  
- Documentación **Done**.  
- Plan tests **Partial**.  
- Repo público **Done**.

---

## Resumen de pendientes (acción rápida)

- **Verify (funcional):** HU 3,5,6,8,9,12,16–18,23,27–29,35.  
- **Notas especiales HU 27 (Redes):** Instagram no admite web-share directo en desktop; solución: **Share modal** con:  
  - **Facebook**: `https://www.facebook.com/sharer/sharer.php?u={url}`  
  - **X/Twitter**: `https://twitter.com/intent/tweet?url={url}&text={msg}`  
  - **Instagram**: **copiar enlace** + botón “Open Instagram” (móvil: `intent://share` si aplica).  
- **Tests automatizados:** ver `docs/QA_TEST_PLAN.md`.  
- **Admin no responsive (HU 9):** asegurar “no disponible en mobile” con guard de viewport.

