# CHANGELOG

## Sprint 1 — Structure & Products
### Added
- Header sticky 100% width with left logo/slogan and right CTA buttons (Sign up / Sign in).
- Home main layout (search block + categories + recommended products).
- Admin panel shell at `/admin` (desktop only).
- Product CRUD: add, list (admin), delete with confirmation.
- Product detail page with description and images.
- Global footer with logo, year and copyright.
### Changed
- Home cards grid to 2 columns and randomize up to 10 items.
### Fixed
- Defensive checks for duplicated product names on create.
### Docs
- README: setup, environment vars, demo accounts, smoke tests.

## Sprint 2 — Auth, Roles, Categories & Features
### Added
- User registration with validations; login (JWT) and logout.
- User menu with initials avatar, profile and favorites.
- Role-based access: ADMIN can access management sections.
- Category management (create, assign to products, filter by category).
- Features management and display on product detail.
### Changed
- Category filter block on Home with friendly copy.
### Fixed
- Session/guard redirects after login to preserve intent route.
### Docs
- Added Postman collection and environment (this repo’s /docs/postman).

## Sprint 3 — Search, Availability, Favorites, Share, Policies, Ratings
### Added
- Search block with helper text, city/name autocomplete and double calendar.
- Availability calendar on product detail with disabled busy dates.
- Favorites (toggle heart) and Favorites list.
- Policies page with site rules, health & safety and cancellations.
- Share button on product detail (native share/deeplinks).
- Ratings & reviews: authenticated users can post reviews; average updates.
### Changed
- Error handling toasts on availability/search failures.
### Fixed
- Keep categories and recommendations on search results page.
### Docs
- Added QA plan (per HU) and evidence index.

## Sprint 4 — Booking End-to-End, WhatsApp & Email
### Added
- Booking flow: select dates → review details → confirm → success page.
- My bookings: list with statuses (CONFIRMED/CANCELLED) and cancel action.
- WhatsApp floating button (bottom-right) for contact.
- Email confirmation (HTML) on booking via Mailpit.
### Changed
- Login gate before booking; redirect back after auth.
### Docs
- Evidence pack guidelines and test cases for booking scenarios.
