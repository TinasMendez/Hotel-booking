# Digital Booking Frontend (React + Vite)

Minimal scaffold to consume the Spring Boot API.

## Quick start
npm install
cp .env.example .env
# set VITE_API_BASE_URL (e.g. http://localhost:8080)
npm run dev

## Notes
- Axios automatically attaches JWT from localStorage.
- Protected routes wrapped by <AuthGuard />.
