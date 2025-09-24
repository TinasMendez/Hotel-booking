# Test Plan — Digital Booking

> Purpose: Map each User Story (HU) to clear test cases with steps, expected result and evidence path.
> How to use: tick each case, attach screenshot/screencast into the evidence path, and link them in INDEX.md.

## Legend
- Result: PASS / FAIL
- Evidence: store under `/docs/evidence/<sprint>/HU-XX-<short-name>.png|mp4`

---

## Sprint 1

### HU #1 — Header sticky & responsive
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H1-01 | Open Home, scroll down | Header remains visible (sticky) and 100% width |  | /docs/evidence/s1/HU-01-sticky-header.png |
| S1-H1-02 | Resize to mobile/tablet | Layout responsive, logo+tagline left, CTAs right (or menu) |  | /docs/evidence/s1/HU-01-responsive.mp4 |

### HU #2 — Main 3 blocks
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H2-01 | Open Home | See search, categories and recommendations blocks |  | /docs/evidence/s1/HU-02-home-blocks.png |

### HU #3 — Register product
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H3-01 | Admin → Add product, fill valid data | Product appears in list |  | /docs/evidence/s1/HU-03-add-product.png |
| S1-H3-02 | Add with duplicated name | Error “name in use”, no creation |  | /docs/evidence/s1/HU-03-duplicate.png |

### HU #4 — Home random ≤10
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H4-01 | Refresh Home 3× | ≤10 items, no duplicates, order not predictable |  | /docs/evidence/s1/HU-04-random.png |

### HU #5 — Product detail (title/back/desc/images)
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H5-01 | Open product detail | Full-width header, left title, back arrow on right, description + images |  | /docs/evidence/s1/HU-05-detail.png |

### HU #6 — Gallery 1+4 + “View more”
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H6-01 | Open detail with ≥5 images | 1 large left + 4-grid right + “View more” |  | /docs/evidence/s1/HU-06-gallery.png |

### HU #7 — Footer global
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H7-01 | Navigate several pages | Footer visible everywhere, legible |  | /docs/evidence/s1/HU-07-footer.png |

### HU #8 — Pagination (if applicable)
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H8-01 | Navigate page controls | Shows ≤10 per page; next/prev work |  | /docs/evidence/s1/HU-08-pagination.mp4 |

### HU #9 — Admin not available on mobile
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H9-01 | Mobile viewport → /admin | Message “Administration is not available on mobile” + back to home |  | /docs/evidence/s1/HU-09-admin-mobile.png |

### HU #10–#11 — List & delete product
| ID | Steps | Expected | Result | Evidence |
|---|---|---|---|---|
| S1-H10-01 | Admin list | Columns Id, Name, Actions |  | /docs/evidence/s1/HU-10-list.png |
| S1-H11-01 | Delete product (confirm) | Item removed from DB and UI |  | /docs/evidence/s1/HU-11-delete.png |

---

## Sprint 2 (registro, login, roles, categorías, features)
*(…lista completa similar; abreviado por espacio…)*

- HU #12 Categorizar productos → filtro ok.
- HU #13 Registro (validaciones).
- HU #14 Login (errores, éxito).
- HU #15 Logout.
- HU #16 Rol admin (menú admin).
- HU #17/18 Features CRUD + display.
- HU #21 Agregar categoría.

---

## Sprint 3 (búsqueda, disponibilidad, favoritos, share, políticas, ratings)

- HU #22 Búsqueda: título, helper text, autosuggest, 2 datepickers, botón, mantiene bloques.
- HU #23 Disponibilidad: fechas ocupadas disabled; error toast con retry.
- HU #24 Favoritos toggle y listado.
- HU #25 Perfil visible.
- HU #26 Políticas.
- HU #27 Share abre opciones (FB/X/IG o share nativo).
- **HU #28 Ratings**:
  - S3-H28-01: Usuario **con reserva finalizada** puede puntuar → éxito.
  - S3-H28-02: Usuario **sin reserva finalizada** intenta puntuar → rechazado.
  - S3-H28-03: Promedio y #reviews visibles en detalle **y** en resultados; promedio actualiza en tiempo real.

- **HU #29 Eliminar categoría**:
  - S3-H29-01: DELETE categoría sin productos → 204.
  - S3-H29-02: DELETE categoría con productos → 409.
  - S3-H29-03: DELETE categoría inexistente → 404.

---

## Sprint 4 (booking, historial, WhatsApp, email)
- HU #30 Login gate y selección de fechas.
- HU #31 Página de detalles (producto + usuario + rango).
- HU #32 Crear reserva (success + errores).
- HU #33 Historial (estados + cancelar).
- HU #34 WhatsApp (deeplink + **toast “Opening WhatsApp…”**).
- HU #35 Email confirmación en Mailpit.

---
