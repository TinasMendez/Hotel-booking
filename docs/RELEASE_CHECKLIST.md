# Release Checklist

## Pre-release
- [ ] `.env` completos (backend y frontend); JWT_SECRET rotado.
- [ ] Base de datos migrada con usuario restringido (no root).
- [ ] SMTP real configurado (no Mailpit).
- [ ] `VITE_API_BASE` y `VITE_WHATSAPP_NUMBER` definidos.
- [ ] Seed QA desactivado en prod.
- [ ] `/actuator/health` público; `/actuator/info` según política.

## Validación funcional
- [ ] Smoke test 5 minutos (README).
- [ ] HU 1–35 **verde** (ver `docs/SPRINT_COMPLIANCE.md`).
- [ ] Admin no responsive en móvil (HU 9) mostrando mensaje.

## Seguridad
- [ ] CORS restrictivo (dominios permitidos).
- [ ] Cabeceras de seguridad en frontend (meta/CSP si aplica).
- [ ] No logs de secretos.

## Observabilidad
- [ ] Actuator habilitado.
- [ ] Logs con nivel INFO; errores capturados.

## Documentación
- [ ] README actualizado.
- [ ] `docs/QA_TEST_PLAN.md` y `docs/SPRINT_COMPLIANCE.md` incluidos.
- [ ] Postman/Insomnia collection (opcional) exportada.

