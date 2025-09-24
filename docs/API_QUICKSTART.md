# API Quickstart

This short guide shows how to authenticate and hit the most common endpoints.  
Use the Postman environment variables provided in `docs/postman/*`.

## Base URL
- Local: `{{baseUrl}}` (from your Postman environment)

## Auth
- `POST /api/auth/login` → returns `{ token, tokenType }`
- Use header on protected routes: `Authorization: Bearer <token>`

## Common Endpoints

### Products
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/admin/products` (Admin)

### Categories
- `GET /api/categories`
- `POST /api/admin/categories` (Admin)
- `PUT /api/categories/{id}` (Admin)
- `DELETE /api/categories/{id}` (Admin)

### Cities
- `GET /api/cities`
- `POST /api/cities` (Admin or as allowed by your API)

### Features
- `GET /api/features`
- `POST /api/admin/features` (Admin)
- `PUT /api/features/{id}` (Admin)
- `DELETE /api/features/{id}` (Admin)

### Favorites
- `GET /api/favorites`
- `POST /api/favorites/{productId}` (toggle/add)

### Availability
- `GET /api/bookings/blocked?productId={id}&start={yyyy-mm-dd}&end={yyyy-mm-dd}`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/me`
- `POST /api/bookings/{id}/cancel`

## Error format (JSON)
See `docs/ARCHITECTURE.md` → **Error Model** for the API error envelope example.
