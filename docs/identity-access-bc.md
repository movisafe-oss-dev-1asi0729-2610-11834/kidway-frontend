# 1BC — Identity & Access Management

This frontend version adds a static IAM flow prepared for a future backend integration.

## Routes

- `/auth/login`: static login page with role-based demo users.
- `/auth/register`: mock registration page with password confirmation validation.
- `/app/*`: protected application routes.

## Static credentials

The users are stored in `server/db.json` under `identityUsers` and are also available as a fallback in `AuthService`.

| Role | Username | Password |
|---|---|---|
| Company Admin | `maria.lopez` | `KidWay123$` |
| Parent / Guardian | `juan.ruiz` | `Parent123$` |
| Independent Operator | `carlos.perez` | `Driver123$` |
| KidWay Administrator | `admin.kidway` | `Admin123$` |

## Access control

- `authGuard` blocks direct access to `/app/*` when there is no active session.
- `roleGuard` blocks modules that are not enabled for the authenticated role.
- The sidebar displays only modules enabled for the current role.
- Billing & Plan appears only for roles with billing permission.
- Sign out clears the local session and redirects to `/auth/login`.

## Backend readiness

The current implementation uses local storage for session simulation and JSON Server for demo users. Later, the same service can be connected to backend endpoints for login, refresh token, logout and account registration.
