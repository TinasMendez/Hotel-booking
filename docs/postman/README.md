# Postman — How to Run

## 1) Import
- Environment: `DigitalBooking.postman_environment.json`
- Collection: `DigitalBooking.postman_collection.json`

## 2) Set Environment Active
Pick **Digital Booking Local Environment** in the top-right selector.

## 3) Login to capture token
Run **POST Login** → script stores JWT into `{{token}}`.

## 4) Smoke flow (manual)
1. GET Products
2. GET Categories
3. POST Cities (optional)
4. POST Booking (requires valid product + date range)
5. GET My Bookings

> If you prefer CLI:  
> `npx newman run docs/postman/DigitalBooking.postman_collection.json -e docs/postman/DigitalBooking.postman_environment.json`
