# Traceability Matrix — User Stories → UI / API

> Goal: Map each HU to the exact screen/route and API(s) to verify quickly.

## Sprint 1
| HU | Title | UI Route / Component | API / DB Touchpoints | Evidence |
|---|---|---|---|---|
| #1 | Header sticky | `/` (Header) | — | s1/HU-01-sticky-header.png |
| #2 | Main blocks | `/` (Search, Categories, Recommendations) | `GET /api/products` · `GET /api/categories` | s1/HU-02-home-blocks.png |
| #3 | Add product | `/admin/products/new` | `POST /api/admin/products` | — |
| #4 | ≤10 random on Home | `/` (Reco grid) | `GET /api/products?limit=10&random=true` | — |
| #5 | Product detail | `/product/:id` | `GET /api/products/{id}` | — |
| #6 | Gallery 1+4 | `/product/:id` | `GET /api/products/{id}` (images) | s1/HU-06-gallery-1-plus-4.png |
| #7 | Footer global | All pages | — | s1/HU-07-footer.png |
| #8 | Pagination ≤10 | `/` or `/search` | `GET /api/products?page={n}&size=10` | s1/HU-08-pagination.mp4 |
| #9 | Admin mobile off | `/admin` (mobile) | — | s1/HU-09-admin-mobile.png |

## Sprint 2
| HU | Title | UI Route / Component | API | Evidence |
|---|---|---|---|---|
| #12 | Categorize product | `/admin/products/:id/edit` | `PUT /api/admin/products/{id}` | — |
| #13 | Register | `/register` | `POST /api/auth/register` | s2/HU-13-register.png |
| #14 | Login | `/login` | `POST /api/auth/login` | s2/HU-14-login-success.png |
| #15 | Logout | Header menu | — | — |
| #16 | Admin role | Header → Admin | `GET /api/users/me` | s2/HU-16-admin-role.png |
| #17–18 | Features CRUD + display | `/admin/features`, `/product/:id` | `CRUD /api/admin/features` | s2/HU-17-18-features.png |
| #21 | Add category | `/admin/categories/new` | `POST /api/admin/categories` | s2/HU-21-add-category.png |

## Sprint 3
| HU | Title | UI Route | API | Evidence |
|---|---|---|---|---|
| #22 | Search | `/` (search) · `/search` | `GET /api/products/search?...` | s3/HU-22-search-autosuggest.png |
| #23 | Availability | `/product/:id` | `GET /api/bookings/blocked?productId=&start=&end=` | s3/HU-23-availability-calendar.png |
| #24 | Favorites | Cards & detail | `POST /api/favorites/{productId}` · `GET /api/favorites` | s3/HU-24-favorites.png |
| #25 | My profile | `/profile` | `GET /api/users/me` | s3/HU-25-profile.png |
| #26 | Policies | `/policies` | — | s3/HU-26-policies.png |
| #27 | Share | `/product/:id` | Deeplinks | s3/HU-27-share.png |
| #28 | Ratings | `/product/:id` | `POST /api/ratings` · `GET /api/ratings/product/{id}` | s3/HU-28-ratings.png |
| #29 | Delete category | `/admin/categories` | `DELETE /api/categories/{id}` | s3/HU-29-delete-category-204.png · s3/HU-29-delete-category-409.png |

## Sprint 4
| HU | Title | UI Route | API | Evidence |
|---|---|---|---|---|
| #30 | Booking — select | `/product/:id` → Reserve | `GET /api/bookings/blocked` | s4/HU-30-login-gate.png |
| #31 | Booking details | `/book/:productId` | `GET /api/products/{id}` · `GET /api/users/me` | s4/HU-31-review-details.png |
| #32 | Create booking | Confirm flow | `POST /api/bookings` | s4/HU-32-confirm-success.png · s4/HU-32-reservation-e2e.mp4 |
| #33 | My bookings | `/bookings` | `GET /api/bookings/me` · `POST /api/bookings/{id}/cancel` | s4/HU-33-my-bookings.png |
| #34 | WhatsApp | Floating button | Deeplink | s4/HU-34-whatsapp-deeplink.png |
| #35 | Email confirm | Mailpit | SMTP dev → Mailpit | s4/HU-35-mailpit-booking-email.png |
