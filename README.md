# Local Meetup RSVP Tracker

A full-stack Local Meetup RSVP Tracker built with **Next.js, Node.js, Express, and MySQL**.

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/NithinRavi09/meetup-rsvp-tracker.git
cd meetup-rsvp-tracker
```

### 2. Start the application

Make sure **Docker Desktop is installed and running**, then run:

```bash
docker compose up --build
```

This starts the complete application:

- Next.js frontend
- Node.js + Express backend
- MySQL database

No separate Node.js, npm, or MySQL installation is required.

### 3. Open the application

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

### 4. Login

The following users are seeded automatically. Use any of the email addresses and passwords below to log in:

| Name | Email | Password |
|---|---|---|
| John Doe | john@example.com | Password@123 |
| Sarah Smith | sarah@example.com | Password@123 |
| David Wilson | david@example.com | Password@123 |
| Nithin Ravi | nithin@example.com | Password@123 |

---

## Features

- JWT authentication with secure password hashing
- Create, view, edit, and delete meetup events
- Event ownership and protected backend routes
- RSVP with **Going / Maybe / Declined**
- View event attendees and RSVP status
- Responsive design for desktop, tablet, and mobile
- Instant client-side event search
- Event sorting by **Soonest First / Latest First**
- Dynamic pagination
- Event date/time handling including midnight-crossing events
- Loading, validation, error, and empty states
- Secure API configuration with Helmet, CORS, and rate limiting

---

## Technology Stack

**Frontend**
- Next.js
- React
- Tailwind CSS
- Axios
- Lucide React

**Backend**
- Node.js
- Express
- MySQL
- JWT
- bcryptjs
- mysql2
- Helmet
- express-rate-limit

**Infrastructure**
- Docker
- Docker Compose

---

## Database

The application uses three relational tables:

- `users`
- `events`
- `rsvps`

Foreign keys and unique constraints maintain data integrity and prevent duplicate RSVPs for the same user and event.

---

## Project Structure

```text
meetup-rsvp-tracker/
├── client/              # Next.js frontend
├── server/              # Node.js + Express backend
├── database/            # MySQL initialization
├── docker-compose.yml
└── README.md
```

## Stopping the Application

```bash
docker compose down
```

To stop the containers and remove the database volume for a completely fresh setup:

```bash
docker compose down -v
```
