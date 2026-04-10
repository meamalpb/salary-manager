# Salary Management Tool

## Overview

A minimal yet scalable salary management system designed for HR managers to manage employees and derive salary insights across countries and job titles.

The system supports employee CRUD operations and provides aggregated salary insights, with a focus on performance, maintainability, and clarity of design.

## Local App Setup

The repo now runs as two separate apps during development:

* Rails API in backend on `http://localhost:3000`
* Next.js frontend in frontend on `http://localhost:3001`

This avoids the default port clash and keeps the frontend/backend boundary explicit.

### Environment variables

Backend example: backend/.env.example

* `ALLOWED_ORIGINS` controls which frontend origins Rails accepts through CORS.

Frontend example: frontend/.env.example

* `NEXT_PUBLIC_API_BASE_URL` tells Next.js where the Rails API is running.

### Development

1. In backend, install gems and start Rails on `3000`.
2. In frontend, run `npm run dev`. It now starts on `3001`.
3. Open `http://localhost:3001` to confirm the frontend can reach the Rails health endpoint.

### Production note

Do not keep localhost values in production. Set:

* `ALLOWED_ORIGINS` to the real frontend domain, such as `https://app.example.com`
* `NEXT_PUBLIC_API_BASE_URL` to the public API URL, such as `https://api.example.com`

---

## Tech Stack

* **Backend:** Ruby on Rails (API mode)
* **Database:** SQLite
* **Frontend:** React (planned)
* **Testing:** RSpec + FactoryBot + Faker
* **Linting:** RuboCop

---

## Architecture

This project follows a **monorepo structure**:

```
salary_tool/
  backend/   # Rails API
  frontend/  # React app (planned)
```

### Design Philosophy

* Keep backend and frontend **decoupled but co-located**
* Focus on **API-first design**

---

## Data Model

### Employee

| Field         | Type     | Description                       |
| ------------- | -------- | --------------------------------- |
| id            | integer  | Primary key                       |
| first_name    | string   | Employee first name               |
| last_name     | string   | Employee last name                |
| job_title     | string   | Role of the employee              |
| country       | string   | Country of employment             |
| salary        | decimal  | Employee salary (precision: 10,2) |
| email         | string   | Unique identifier                 |
| mobile_number | string   | Optional contact number           |
| created_at    | datetime | Record creation timestamp         |
| updated_at    | datetime | Record update timestamp           |

### Computed Fields

* `full_name` → derived from `first_name + last_name`

  * Not stored in DB to avoid redundancy

---

## Database Design

### Choice: SQLite

SQLite was chosen for:

* Simplicity
* Zero configuration
* Ease of local setup

The schema is designed to be **fully compatible with PostgreSQL**, allowing easy migration to a production-grade database.

---

### Indexing Strategy

To support efficient queries (especially for 10,000 employees):

* Index on `country`
* Index on `job_title`
* Composite index on `(country, job_title)`
* Unique index on `email`

These indexes optimize salary insight queries such as:

* Salary distribution per country
* Salary per job title within a country

---

### Data Integrity

* Enforced using:

  * Database-level constraints (`NOT NULL`, unique index)
  * Model-level validations

---

## API Design

### Principles

* RESTful endpoints
* Explicit JSON responses
* Consistent error handling

### Endpoints

Employee CRUD:

* `GET /employees` - list employees
* `GET /employees/:id` - fetch a single employee
* `POST /employees` - create employee
* `PATCH /employees/:id` - update employee
* `DELETE /employees/:id` - delete employee

Salary insights:

* `GET /salary_insights/country_stats?country=India`
  * Returns `min_salary`, `max_salary`, and `avg_salary` for a country
* `GET /salary_insights/job_title_stats?country=India&job_title=Engineer`
  * Returns `avg_salary` for a job title within a country

### Serialization

A lightweight serializer layer is used to:

* Control API output explicitly
* Avoid over-reliance on default Rails JSON rendering
* Keep implementation simple without external gems
* Separate presentation logic from models and controllers

---

## Salary Insights Design

Salary insights logic is isolated in a dedicated service object:

* `SalaryInsightsService#country_stats(country)`
* `SalaryInsightsService#job_title_stats(country:, job_title:)`

The controller (`SalaryInsightsController`) remains thin and delegates calculations
to the service. This keeps business rules out of controllers and improves
testability.

---

## Validation Strategy

The `Employee` model enforces:

* Presence of required fields
* Salary ≥ 0
* Unique email (case-insensitive)
* Valid email format

This ensures correctness at both application and database levels.

---

## Testing Strategy

* Framework: RSpec
* Factories: FactoryBot with Faker

### Approach

* Tests written alongside features (incremental TDD approach)
* Focus on:

  * Model validations
  * Core business logic
  * API behavior (employees + salary insights)
  * Service behavior (salary insights calculations)

### Request Spec Style

Request specs for salary insights use RSpec `:aggregate_failures` so related
response assertions are reported together in one example.

### Goals

* Fast and deterministic tests
* Clear and minimal test cases
* High confidence in core functionality

---

## Linting

Code quality is enforced with RuboCop and Rails/RSpec cops:

* `rubocop`
* `rubocop-rails`
* `rubocop-rspec`
* `rubocop-factory_bot`

Run linters from the backend folder:

```bash
cd backend
bundle exec rubocop
```

Project lint rules live in:

* `backend/.rubocop.yml`
* `backend/.rubocop_todo.yml`

---

## Seeding Strategy (Planned)

* Generate 10,000 employees using:

  * `first_names.txt`
  * `last_names.txt`
* Emails generated deterministically:

  * `first_name.last_name_random_number@company.com`
* Batch inserts will be used for performance

---

## Future Improvements

* Pagination for employee listing
* Filtering (country, job title)
* Frontend dashboard (React)
* Deployment setup
* CI pipeline using GitHub Actions

---

## Trade-offs

| Decision          | Trade-off                                  |
| ----------------- | ------------------------------------------ |
| SQLite            | Simplicity over production scalability     |
| Monorepo          | Ease of development over strict separation |

---

## How to Run (Backend)

```bash
cd backend
bundle install
rails db:create db:migrate
rails s
```
