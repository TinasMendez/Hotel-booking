# Known Issues / Follow-ups

1) **HU 27 — Instagram share (web)**  
   - Limitación de la plataforma: no hay intent web oficial en desktop.  
   - Solución: “Copy link” + botón “Open Instagram” (móvil). Mantener Facebook/Twitter con sharers oficiales.

2) **HU 9 — Admin no responsive**  
   - Asegurar guard de viewport para mostrar “not available on mobile”.

3) **Seeds/Imagenes**  
   - Algunos favoritos carecen de imagen directa; ya se enriquece desde `/products/:id`. Mantener placeholder como fallback.

4) **README env example**  
   - Mantener `VITE_WHATSAPP_NUMBER` **documentada pero vacía** en `.env.example` para evitar inconsistencias.

