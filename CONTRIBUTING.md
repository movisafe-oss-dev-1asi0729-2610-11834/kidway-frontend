# Contributing Guide

This project follows GitFlow, Conventional Commits, English naming conventions and a DDD-oriented frontend structure.

## Branching model

Use the following branches:

- `main`: stable releases only.
- `develop`: integration branch for the current delivery.
- `feature/<bounded-context>-<short-description>`: feature work per Bounded Context.
- `release/<version>`: release stabilization.
- `hotfix/<short-description>`: urgent fixes from `main`.

Examples:

```bash
git checkout develop
git checkout -b feature/fleet-management-base-views
```

## Conventional Commits

Use concise commit messages in English:

```text
feat: add fleet management list view
fix: correct dashboard route redirection
docs: update frontend setup instructions
style: adjust sidebar spacing for mobile
refactor: simplify notification card component
```

## DDD implementation rules

Each Bounded Context already has the required folders. Do not create duplicate root folders for a BC.

Use this placement rule:

- `domain/`: entities, value objects, interfaces and core models.
- `application/`: use cases, services, facades and state management.
- `infrastructure/`: HTTP clients, mappers and API adapters.
- `presentation/`: routes, pages, views and visual components.

## Routing rules

Each BC owns its `presentation/routes.ts` file. Add module routes there and keep `src/app/app.routes.ts` as the app-level registry.

Good route names:

```text
/app/fleet
/app/fleet/vehicles
/app/routes/schedules
/app/trips/active
/app/attendance/daily
```

Avoid names based on variables or implementation details.

## i18n rules

Every user-facing string must be translated in:

```text
src/locales/en.json
src/locales/es.json
```

The default language is English. Spanish uses Latin American Spanish style.

## Accessibility rules

- Use semantic HTML when possible.
- Add `alt` text to meaningful images.
- Add `aria-label` to icon-only buttons.
- Keep visible focus states and sufficient contrast.
- Do not use color as the only way to communicate status.

## Pull request checklist

Before merging into `develop`, verify:

- The module is responsive.
- The route works directly from the browser URL.
- No raw translation keys are visible.
- The sidebar and topbar still work in desktop and mobile.
- JSON Server mocks are updated when needed.
- The implementation respects the BC folder structure.

## Suggested workflow for each teammate

1. Pull the latest `develop`.
2. Create a feature branch for the assigned BC.
3. Implement views inside the existing BC folders.
4. Add or update translation keys.
5. Run the app locally.
6. Commit using Conventional Commits.
7. Open a pull request into `develop`.
