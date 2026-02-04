# Aquection - Auction Aggregator Platform
## Project Overview
**Aquection** is a comprehensive Auction Aggregator Platform designed for the Indian market. It aggregates publicly available bank financial institution auction information, providing a unified interface for investors, agents, and the general public.

**Disclaimer:** This platform does NOT conduct auctions. It is an information aggregator only.

## 1. System Architecture
The system follows a modern microservices-ready monolithic architecture.

- **Client (Frontend):** React.js + Tailwind CSS (SPA)
- **Server (Backend):** Spring Boot (Java) REST API
- **Database:** MySQL (Relational Data)
- **External Services:** Razorpay (Payments), Email/SMS Gateways

## 2. Database Schema
### Tables
1.  **users**
    *   `id` (BIGINT, PK)
    *   `email` (VARCHAR, Unique)
    *   `password_hash` (VARCHAR)
    *   `role` (ENUM: USER, ADMIN, BROKER)
    *   `is_premium` (BOOLEAN)
    *   `created_at`, `updated_at`

2.  **banks**
    *   `id` (INT, PK)
    *   `name` (VARCHAR)
    *   `logo_url` (VARCHAR)
    *   `contact_info` (TEXT)

3.  **cities**
    *   `id` (INT, PK)
    *   `name` (VARCHAR)
    *   `state` (VARCHAR)

4.  **property_types**
    *   `id` (INT, PK)
    *   `name` (VARCHAR) (e.g., Residential, Commercial, Land)

5.  **auctions**
    *   `id` (BIGINT, PK)
    *   `title` (VARCHAR)
    *   `description` (TEXT)
    *   `bank_id` (FK -> banks)
    *   `city_id` (FK -> cities)
    *   `property_type_id` (FK -> property_types)
    *   `reserve_price` (DECIMAL)
    *   `emd_amount` (DECIMAL)
    *   `auction_date` (DATETIME)
    *   `notice_url` (VARCHAR) - Link to PDF/Source
    *   `is_active` (BOOLEAN)
    *   `created_at`, `updated_at`

6.  **saved_auctions**
    *   `id` (BIGINT, PK)
    *   `user_id` (FK -> users)
    *   `auction_id` (FK -> auctions)

7.  **subscriptions**
    *   `id` (BIGINT, PK)
    *   `name` (VARCHAR) (e.g., Monthly, Yearly)
    *   `price` (DECIMAL)
    *   `duration_days` (INT)

8.  **payments**
    *   `id` (BIGINT, PK)
    *   `user_id` (FK -> users)
    *   `subscription_id` (FK -> subscriptions)
    *   `amount` (DECIMAL)
    *   `transaction_id` (VARCHAR)
    *   `status` (ENUM: SUCCESS, PENDING, FAILED)
    *   `payment_date` (DATETIME)

9.  **blogs**
    *   `id` (BIGINT, PK)
    *   `title` (VARCHAR)
    *   `slug` (VARCHAR)
    *   `content` (TEXT)
    *   `author_id` (FK -> users)
    *   `created_at`

## 3. Directory Structure
```
aquection/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── context/        # Global state (Auth, etc.)
│   │   ├── services/       # API call functions
│   │   └── assets/         # Images, fonts
│   └── ...
├── server/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aquection/
│   │   │   │   ├── config/         # Security, Swagger config
│   │   │   │   ├── controller/     # REST Endpoints
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── entity/         # JPA Entities
│   │   │   │   ├── repository/     # JPA Repositories
│   │   │   │   ├── service/        # Business Logic
│   │   │   │   └── AquectionApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   └── pom.xml
└── README.md
```

## 4. API Endpoints (Core)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auctions` (with filters: city, bank, type, price)
- `GET /api/auctions/{id}`
- `POST /api/user/saved-auctions`
- `GET /api/admin/stats` (Admin only)
- `POST /api/payment/create-order`

## 5. Development Roadmap
1.  **Phase 1 (MVP):** Basic manual entry of auctions, Search, User Auth, responsive UI.
2.  **Phase 2 (Monetization):** Premium plans, Razorpay integration, restricted details for free users.
3.  **Phase 3 (Automation):** Data ingestion pipelines, Email alerts.
