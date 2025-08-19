# Hotel Reservation Backend (Spring Boot 3.5.3, Java 21)

Backend for a hotel reservation platform using **Spring Boot**, **JPA/Hibernate**, **JWT Security**, and **MySQL** (dev) / **H2** (tests).  
This project intentionally avoids Lombok — all constructors/getters/setters are **manual**.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Development)](#quick-start-development)
- [Environments & Profiles](#environments--profiles)
- [Database & Seed Data](#database--seed-data)
- [Security (JWT)](#security-jwt)
- [API Docs (Swagger)](#api-docs-swagger)
- [Postman Collection](#postman-collection)
- [Build & Test](#build--test)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Overview
- **Domain**: Products (hotels/rooms), Categories, Cities, Features, Bookings, Users & Roles, Customers.
- **Relationships**: `Product` -> `Category` (ManyToOne), `Product` -> `City` (ManyToOne), `Product` <-> `Feature` (ManyToMany).
- **Bookings**: use `productId`, `customerId`, `startDate`, `endDate`, and `BookingStatus` enum.  
- **Security**: JWT-based auth with `SecurityFilterChain`, `JwtFilter`, and `CustomUserDetailsService`.

## Tech Stack
- Java 21, Spring Boot 3.5.3
- Spring Web, Spring Security, Spring Data JPA
- MySQL (dev), H2 (tests)
- JJWT 0.11.5
- Springdoc OpenAPI (Swagger UI)

## Prerequisites
- Java 21
- Maven 3.9+ (or use the Wrapper `./mvnw`)
- MySQL running locally

**Default MySQL dev config:**
