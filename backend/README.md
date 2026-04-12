# Backend

Rails API for the salary manager demo.

## Stack

- Ruby `3.1.6`
- Rails `7.1`
- SQLite
- Devise + `devise-jwt` for authentication

## Setup

1. Install gems:

```bash
bundle install
```

2. Configure environment variables. At minimum:

```bash
ALLOWED_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
DEVISE_JWT_SECRET_KEY=replace_with_a_long_random_secret
```

3. Prepare the database:

```bash
bundle exec rails db:prepare
bundle exec rails db:seed
```

4. Start the server:

```bash
bundle exec rails server
```

## User Auth

Authentication is backend-only for this demo.

- `User` uses Devise database authentication plus JWT
- Login is `email + password` only
- `username` still exists as a column, but it is not used for login
- `employee_id` on `users` is optional
- Signup, forgot-password, and mailer-driven flows are intentionally not included

### Auth Endpoints

- `POST /login`
- `DELETE /logout`

### Login Request

```json
{
  "user": {
    "email": "demo@example.com",
    "password": "Password@123"
  }
}
```

### Login Response

The JWT is returned in the `Authorization` response header as a Bearer token.

Example response body:

```json
{
  "message": "Logged in successfully.",
  "user": {
    "id": 1,
    "email": "demo@example.com",
    "username": "demo_user",
    "employee_id": "EMP-DEMO-001"
  }
}
```

Use that token on protected requests:

```http
Authorization: Bearer <jwt-token>
```

## Seeded Demo User

`db/seeds.rb` creates one demo user directly:

- Email: `demo@example.com`
- Password: `Password@123`
- Username: `demo_user`
- Employee ID: `EMP-DEMO-001`

It also loads the employee seed data.

## Protected API

These endpoints require a valid JWT:

- `GET /employees`
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `PATCH /employees/:id`
- `DELETE /employees/:id`
- `GET /salary_insights/country_stats`
- `GET /salary_insights/job_title_stats`

If authentication is missing or invalid, the API returns `401 Unauthorized` with a JSON error response.

## Tests

Run the relevant backend specs with:

```bash
bundle exec rspec spec/requests/authentication_spec.rb spec/requests/employees_spec.rb spec/requests/salary_insights_spec.rb spec/seeds/seeds_spec.rb
```
