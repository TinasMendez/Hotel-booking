# QA Checklist — Digital Booking

> Purpose: Fast, repeatable checklist to verify the 4 sprints (functional + non-functional).
> How to use: Check items as you validate; attach evidence files referenced in `docs/evidence/INDEX.md`.

---

## 0) Scope & Environments

- [ ] **Backend (Local):** http://localhost:8080
- [ ] **Frontend (Local):** http://localhost:5173
- [ ] **Mailpit (Emails):** http://localhost:8025 (Docker)
- [ ] **DB:** MySQL `reservasdb` (user `root`, pass `Tina050898`)

### Preconditions
- [ ] `mvn spring-boot:run` (backend up)
- [ ] `npm run dev` (frontend up)
- [ ] `docker compose up -d mailpit` (if not running)
- [ ] Demo users created (from README) and at least 1 Admin
- [ ] Seed data: categories, products (>= 10), images per product (>= 5) and one product with existing bookings for disabled dates

### Tooling
- [ ] Browsers: Chrome, Firefox, Safari (latest)
- [ ] Postman with collection `/docs/postman/*`
- [ ] DevTools open for console/network errors

---

## 1) Build & CI Sanity
- [ ] `npm run build` completes without errors
- [ ] `mvn clean package -DskipTests` completes without errors
- [ ] CI workflow runs and is green (lint/test/build)

---

## 2) Backend API Sanity (Postman)
- [ ] Auth: register, login (JWT captured in env), `/users/me`
- [ ] Products: list (paged), get by id, search by city+date
- [ ] Categories: list, create (admin), **delete 204/404/409**
- [ ] Features: list, create (admin)
- [ ] Bookings: create, list mine, cancel

---

## 3) Authentication & Roles
- [ ] Register user with validations (bad email, weak password → friendly errors)
- [ ] Login success shows avatar with initials + name
- [ ] Logout clears menu options; protected routes are blocked
- [ ] Admin role sees “Admin panel” and can access it on desktop

---

## 4) Header / Footer / Navigation (HU #1, #7)
- [ ] Header sticky (100% width) in all pages
- [ ] Logo + slogan (click → Home)
- [ ] CTAs visible (Sign up / Sign in) when logged out
- [ ] Footer visible on all pages with © year

---

## 5) Home (HU #2, #4, #8, #20)
- [ ] Three blocks present: **Search**, **Categories**, **Recommendations**
- [ ] Recommendations show **≤ 10** items, no duplicates, randomized
- [ ] (If applicable) Pagination ≤10 per page; next/prev work
- [ ] Categories block with title + helper copy; filter by category works

---

## 6) Product Detail & Gallery (HU #5, #6)
- [ ] Title left, back arrow visible, header full-width
- [ ] Description + images
- [ ] **Gallery 1+4** layout (1 large left + 4-grid right)
- [ ] “View more” opens full gallery/lightbox

---

## 7) Features (HU #17, #18)
- [ ] Admin can add/edit/remove features
- [ ] Detail shows feature list (icons/dots) responsive

---

## 8) Search & Availability (HU #22, #23)
- [ ] Search block shows title + explanatory text
- [ ] Autocomplete/suggestions while typing
- [ ] Double calendar for date range; search filters results
- [ ] Product detail calendar disables already booked dates
- [ ] Network/API failures show clear error toast + retry option

---

## 9) Favorites (HU #24, #25)
- [ ] Heart toggle requires login; updates instantly
- [ ] Favorites list shows saved items; can remove from list

---

## 10) Ratings & Reviews (HU #28)
- [ ] Only users with **completed** booking can submit a rating
- [ ] New rating updates average in real time
- [ ] Detail shows stars, author name, date, optional comment
- [ ] **Average and #reviews** are displayed on detail **and** in results/listing

---

## 11) Booking Flow (HU #30, #31, #32)
- [ ] From product detail → **Reserve**: if not logged in, redirect to login with message; then back to intent route
- [ ] Booking details page shows product info, user data, selected valid range
- [ ] Confirm booking → success page
- [ ] Invalid data (e.g., overlaps with disabled dates) → specific error + guidance

---

## 12) My Bookings (HU #33)
- [ ] List shows status **CONFIRMED / CANCELLED**
- [ ] Cancel action works and updates status
- [ ] “Book again” present and navigates to product

---

## 13) WhatsApp CTA (HU #34)
- [ ] Floating button bottom-right, always visible
- [ ] Click opens WhatsApp deeplink (web/app)
- [ ] Show toast “Opening WhatsApp…”; handle error if number invalid/offline

---

## 14) Email Confirmation (HU #35)
- [ ] After booking, Mailpit receives email within seconds
- [ ] Email HTML shows: product name, dates, guest, property contact, CTA link
- [ ] Email renders well on desktop & mobile preview

---

## 15) Admin Panel (HU #9, #10, #11, #12, #17, #21, #29)
- [ ] Desktop: category/product/feature menus present
- [ ] Mobile: shows “Administration is not available on mobile” screen
- [ ] Product list columns: Id, Name, Actions (view/delete)
- [ ] Delete product with confirmation modal works
- [ ] Category create/edit works
- [ ] **Delete category:** 
  - [ ] No products → **204** (removed from UI)
  - [ ] With products → **409** with message
  - [ ] Nonexistent → **404**
- [ ] Feature admin works

---

## 16) Policies (HU #26)
- [ ] Policies page reachable from footer/menu
- [ ] Copy covers rules, health & safety, cancellations

---

## 17) Performance Smoke
- [ ] Home initial load < 2.5s on local dev (empty cache)
- [ ] Product detail with gallery loads images progressively (no layout shift)
- [ ] No large unused JS warnings in DevTools (major)

---

## 18) Accessibility (Quick a11y)
- [ ] Pages have unique `<title>` and landmarks (header/main/footer)
- [ ] Interactive elements (buttons/links) are keyboard reachable
- [ ] Images have alt text (cards, gallery thumbs if applicable)
- [ ] Color contrast readable for text on backgrounds

---

## 19) Security Quick Checks
- [ ] JWT stored securely (no leakage in query string)
- [ ] Protected endpoints reject anonymous requests
- [ ] Admin-only endpoints reject non-admin token
- [ ] No secrets in front-end source (inspect build)

---

## 20) Cross-Browser / Responsive Matrix
Test pages: Home, Product Detail, My Bookings, Admin List, Policies

| Viewport / Browser | Chrome | Firefox | Safari |
|---|---|---|---|
| Mobile (375×667) | [ ] | [ ] | [ ] |
| Tablet (768×1024) | [ ] | [ ] | [ ] |
| Desktop (1440×900) | [ ] | [ ] | [ ] |

---

## 21) Logs & Errors
- [ ] Browser console free of uncaught errors during critical flows
- [ ] Backend logs show no stack traces on happy paths
- [ ] 4xx errors return clean JSON (ApiError) with message and path

---

## 22) Regression Sanity (by Sprint)
- [ ] S1: Header/Main/Footer still OK after bookings
- [ ] S2: Login/Logout stable; session survives refresh
- [ ] S3: Favorites/Share/Policies/Ratings unaffected by new bookings
- [ ] S4: WhatsApp & Mailpit still OK after category/product changes

---

## 23) Exit Criteria
- [ ] 100% **functional** checklist items checked
- [ ] Non-functional (perf/a11y/security) major issues: **None**
- [ ] Evidence captured and indexed in `/docs/evidence/INDEX.md`
- [ ] CHANGELOG updated
- [ ] CI green on main

---

## 24) Severity Levels
- **Blocker:** prevents main user journeys (login, search, booking)
- **Critical:** data loss, security, payments (N/A)
- **Major:** feature broken but workaround exists
- **Minor:** UI/UX polish, copy, spacing
- **Trivial:** Typos/cosmetic

---

## 25) Bug Report Template
Title: <Area> - <short problem>
Environment: <browser/device/backend version>
Steps:

...

...

...
Expected: ...
Actual: ...
Severity: <Blocker/Critical/Major/Minor/Trivial>
Evidence: <screenshot/video> ; Console/Network logs if applicable