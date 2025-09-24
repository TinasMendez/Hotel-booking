# Traceability Matrix — User Stories → UI / API

> Goal: Map each HU to the exact screen/route and API(s) to verify quickly.

## Sprint 1
| HU | Title | UI Route / Component | API / DB Touchpoints | Evidence |
|---|---|---|---|---|
| #1 | Header sticky | `/` (Header) | — | s1/HU-01-sticky-header.png |
| #2 | Main blocks | `/` (Search, Categories, Reco) | `GET /api/products` `GET /api/categories` | s1/HU-02-home-blocks.png |
| #3 | Add product | `/admin/products/new` | `POST /api/admin/products` | s1/HU-03-add-product.png |
| #4 | ≤10 random | `/` (Reco grid) | `GET /api/products?limit=10&random=true` | s1/HU-04-random.png |
| #5 | Product detail | `/product/:id` | `GET /api/products/{id}` | s1/HU-05-detail.png |
| #6 | Gallery 1+4 | `/product/:id` | `GET /api/products/{id}` (images) | s1/HU-06-gallery.png |
| #7 | Footer global | All pages | — | s1/HU-07-footer.png |
| #8 | Pagination | `/` or `/search` | `GET /api/products?page=..&size=10` | s1/HU-08-pagination.mp4 |
| #9 | Admin mobile off | `/admin` (mobile) | — | s1/HU-09-admin-mobile.png |
| #10–11 | List/Delete product | `/admin/products` | `GET /api/admin/products` `DELETE /api/admin/products/{id}` | s1/HU-10-list.png, s1/HU-11-delete.png |

## Sprint 2
| HU | Title | UI Route / Component | API | Evidence |
|---|---|---|---|---|
| #12 | Categorize | `/admin/products/:id/edit` | `PUT /api/admin/products/{id}` | s2/HU-12-category-assign.png |
| #13 | Register | `/register` | `POST /api/auth/register` | s2/HU-13-register.png |
| #14 | Login | `/login` | `POST /api/auth/login` | s2/HU-14-login-success.png |
| #15 | Logout | header menu | — | s2/HU-15-logout.png |
| #16 | Admin role | header menu → Admin | `GET /api/users/me` (roles) | s2/HU-16-admin-role.png |
| #17–18 | Features | `/admin/features`, `/product/:id` | `CRUD /api/admin/features` | s2/HU-17-18-features.png |
| #21 | Add category | `/admin/categories/new` | `POST /api/admin/categories` | s2/HU-21-add-category.png |

## Sprint 3
| HU | Title | UI Route | API | Evidence |
|---|---|---|---|---|
| #22 | Search | `/` (search) `/search` | `GET /api/products/search?...` | s3/HU-22-search.png |
| #23 | Availability | `/product/:id` | `GET /api/bookings/blocked?productId=&start=&end=` | s3/HU-23-availability.png |
| #24 | Favorite | product cards & detail | `POST /api/favorites/{productId}`, `GET /api/favorites` | s3/HU-24-favorites.png |
| #25 | My profile | `/profile` | `GET /api/users/me` | s3/HU-25-profile.png |
| #26 | Policies | `/policies` | — | s3/HU-26-policies.png |
| #27 | Share | `/product/:id` | deeplinks | s3/HU-27-share.png |
| #28 | Ratings | `/product/:id` | `POST /api/ratings` `GET /api/ratings/product/{id}` | s3/HU-28-*.png |
| #29 | Delete category | `/admin/categories` | `DELETE /api/categories/{id}` | s3/HU-29-*.png |

## Sprint 4
| HU | Title | UI Route | API | Evidence |
|---|---|---|---|---|
| #30 | Booking – select | `/product/:id` → Reserve | `GET /api/bookings/blocked` | s4/HU-30-login-gate.png |
| #31 | Booking details | `/book/:productId` | `GET /api/products/{id}` `GET /api/users/me` | s4/HU-31-review-details.png |
| #32 | Create booking | confirm flow | `POST /api/bookings` | s4/HU-32-confirm-success.png |
| #33 | My bookings | `/bookings` | `GET /api/bookings/me` `POST /api/bookings/{id}/cancel` | s4/HU-33-my-bookings.png |
| #34 | WhatsApp | float button | deeplink | s4/HU-34-whatsapp-deeplink.png |
| #35 | Email confirm | Mailpit | SMTP dev → Mailpit | s4/HU-35-mailpit-booking-email.png |
