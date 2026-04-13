# Approach

## Tech choices
- **Rails 7** — matched my existing Ruby 3.1.6 environment; closest stable version
- **Next.js over plain React** — convention-over-config felt aligned with Rails; also wanted to explore its additional features
- **Tailwind + DaisyUI** — picked up from a tutorial, felt like a good fit for rapid UI work
- **SQLite** — sufficient for a demo; Render resets data on restart anyway, and all essentials are re-seeded
- **Devise-JWT** — not in the spec but felt necessary for a realistic HR tool

## Deployment
Backend on Render (free tier, spins down after 15 min of inactivity). UptimeRobot pings every 5 min to keep it warm and doubles as uptime monitoring.

## AI usage
Used for debugging, updating readme, frontend styling decisions, and fixing linting issues. Architecture, data model, and core logic decisions were made independently.

## CI
GitHub Actions runs RuboCop, RSpec, and ESLint on every push to master.

## How I built it

Started with Rails — configured RuboCop and RSpec before writing any business logic, so quality tooling was in place from the start.

Backend first: built the Employee model and CRUD API, then Salary Insights. Salary insights logic lives in a service object to keep the controller thin and the business logic testable.

Frontend next: got the Next.js app talking to the Rails API before writing any UI logic. Employee management page first, then salary insights page.

After the core product was working: added seeding per the spec, user auth with Devise-JWT, fixed flaky tests and RuboCop failures, search debouncing, and minor frontend bugs. Deployed backend to Render and frontend to Vercel.