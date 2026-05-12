# KidWay Frontend Web Application

KidWay Frontend is the Angular base template for the MoviSafe school transport monitoring platform. It was prepared as a clean starting point so each team member can implement an assigned Bounded Context in a dedicated GitFlow feature branch without creating or reorganizing the base DDD folder structure.

## Stack

- Angular 21
- TypeScript
- Angular Material and Material Design
- HTML5 and CSS3
- @ngx-translate for i18n
- JSON Server for local mocked data
- GitFlow, Conventional Commits and Semantic Versioning

## Main features in this base version

- Responsive app shell with fixed topbar and collapsible sidebar.
- Sidebar auto-hides on mobile and can be opened with the top-left menu button.
- Pill-style language switcher for English and Spanish.
- Theme toggle, notification shortcut and profile shortcut in the fixed topbar.
- KidWay logo configured in the browser tab, sidebar and assets folder.
- Home dashboard with cards, route coverage donut, notifications and quick module overview.
- Placeholder page for every feature module with animated 🚧 status.
- DDD folders generated for all 16 Bounded Contexts.
- JSON Server configured under `server/`.

## Run locally

```bash
npm install
npm start
```

Open the app at:

```text
http://localhost:4200
```

Run the mocked REST API:

```bash
npm run api
```

The API runs at:

```text
http://localhost:3000/api
```

## Project structure

```text
kidway-frontend/
├── public/
├── server/
│   ├── db.json
│   ├── routes.json
│   └── start.sh
├── src/
│   ├── app/
│   ├── assets/
│   ├── locales/
│   ├── shared/
│   ├── identity-access/
│   ├── user-profiles/
│   ├── subscriptions/
│   ├── dashboard/
│   ├── fleet/
│   ├── drivers/
│   ├── routes/
│   ├── students/
│   ├── assignments/
│   ├── tracking/
│   ├── trips/
│   ├── attendance/
│   ├── notifications/
│   ├── incidents/
│   ├── analytics/
│   └── companies/
├── angular.json
├── package.json
└── tsconfig.json
```

## DDD folder convention per Bounded Context

Each Bounded Context follows this structure:

```text
<bounded-context>/
├── application/
│   ├── services/
│   └── state/
├── domain/
│   ├── entities/
│   └── models/
├── infrastructure/
│   └── http/
└── presentation/
    ├── components/
    ├── views/
    └── routes.ts
```

## Routing convention

Routes are registered from `src/app/app.routes.ts`. Each Bounded Context exposes its own route file from `presentation/routes.ts`.

Example:

```ts
{ path: 'fleet', loadChildren: () => import('../fleet/presentation/routes').then((m) => m.FLEET_ROUTES) }
```

When a teammate implements a module, the recommended workflow is:

1. Create views in `<bc>/presentation/views/`.
2. Create reusable UI pieces in `<bc>/presentation/components/`.
3. Add services/state in `<bc>/application/`.
4. Add entities/models in `<bc>/domain/`.
5. Add HTTP adapters in `<bc>/infrastructure/http/`.
6. Replace the placeholder route in `<bc>/presentation/routes.ts`.

## Sidebar modules

Identity & Access and User Profiles are intentionally not shown in the sidebar. IAM belongs to `/auth/login` and `/auth/register`, while Profile is accessed from the topbar at `/app/profile`.

The sidebar includes the operational modules needed for Independent Operators, Company Admins, KidWay Administrators and future parent/guardian notification views. Role-based hiding can be added later without changing the menu model.

## Internationalization

Translation files are in:

```text
src/locales/en.json
src/locales/es.json
```

All visible labels should be added to both dictionaries. Avoid using raw variable names in templates.

## JSON Server

Mock data is stored in:

```text
server/db.json
server/routes.json
```

The route mapping exposes mocked resources under `/api`.

## Recommended first commit

```bash
git add .
git commit -m "feat: initialize KidWay Angular frontend base template"
```
