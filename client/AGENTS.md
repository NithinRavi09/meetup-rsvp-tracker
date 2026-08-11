<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

# FRONTEND UI IMPLEMENTATION RULES

You are working ONLY on the frontend/client side of this project.

## PRIMARY GOAL

Complete and improve the frontend UI to match the provided/reference designs for:

- Login
- Events listing
- Event details
- Create Meetup
- Edit Meetup

Do NOT implement Delete yet.
Delete will be handled separately after the UI work is complete.

---

## 1. STRICT SCOPE

ONLY modify files inside:

client/

DO NOT modify:

- server/
- database/
- docker-compose.yml
- backend configuration
- backend routes
- backend controllers
- backend services
- backend models
- backend middleware
- API behavior

Do not change existing backend functionality under any circumstances.

---

## 2. PRESERVE EXISTING FUNCTIONALITY

Before changing any existing frontend file:

- Inspect the current implementation.
- Understand what functionality already works.
- Preserve all existing API calls and behavior.
- Do not replace working logic unnecessarily.

Currently working functionality includes:

- Login
- JWT authentication
- Axios API client
- JWT Authorization interceptor
- Events listing
- Event details
- Attendee listing
- RSVP create/update
- Create Meetup
- Edit Meetup

Do NOT break any of these.

After every meaningful change, verify that existing functionality still works.

---

## 3. FOLLOW THE EXISTING PROJECT ARCHITECTURE

Before writing code:

1. Inspect `client/package.json`.
2. Inspect the existing `client/src` structure.
3. Inspect existing components, hooks, context, utilities and API code.
4. Reuse existing files whenever possible.

If a suitable component/util/helper already exists, USE IT.

Do NOT create duplicate components, utilities, API clients, hooks, contexts, or styling systems.

Only create a new file when there is a genuine architectural need.

Keep the architecture clean and reusable.

---

## 4. TECHNOLOGY RULES

Use ONLY the technologies already installed in the project.

IMPORTANT:

- Check `client/package.json` before adding or using libraries.
- DO NOT reinstall existing packages.
- DO NOT replace existing packages.
- DO NOT introduce another UI framework.
- DO NOT introduce another styling solution.
- DO NOT add unnecessary dependencies.

For styling:

- Use the project's existing Tailwind CSS setup.
- DO NOT create separate CSS files for component/page styling.
- DO NOT introduce Bootstrap, Material UI, Chakra, styled-components, etc.
- Reuse existing global styles/configuration where appropriate.

Use the existing Axios setup for API requests.

DO NOT create another Axios instance.

Use the existing authentication/context utilities.

---

## 5. COMPONENT DESIGN

Follow senior-level React/Next.js practices.

Prefer reusable components such as:

- Navbar
- EventCard
- EventList
- Form fields
- Buttons
- RSVP section
- Attendee list
- Page containers
- Empty/loading/error states

But first check whether an equivalent component already exists.

Avoid:

- Huge page components
- Duplicated JSX
- Duplicated Tailwind classes when a reusable component is appropriate
- Copy-pasting the same UI between Create/Edit pages

Create reusable components only when they genuinely improve maintainability.

---

## 6. NEXT.JS

Respect the existing Next.js App Router architecture.

Existing routes include:

- `/login`
- `/events`
- `/events/[id]`
- `/events/create`
- `/events/[id]/edit`

Do not change route structure unnecessarily.

Use `"use client"` only where client-side interactivity is actually required.

Do not introduce unnecessary server/client complexity.

---

## 7. API / DATA CONTRACT

DO NOT change backend API contracts.

Use the existing API client:

```js
api

<!-- END:nextjs-agent-rules -->
