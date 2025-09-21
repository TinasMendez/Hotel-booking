# docs/verification/2025-09-20-login-header.md
## Scope
Validate Sprint 2 HU #13-15 (auth/login/logout) + Sprint 1 HU #1 (Header state).

## Environment
- Frontend: Vite (build ✅)
- Node: v20.x
- API base: $VITE_API_BASE

## Steps
1) Run `npm run verify` in `frontend/`  
2) Observe: lint (warnings only), tests (1 passed), build (success).

## Result
- ✅ Header shows initials, full name and dropdown after login.
- ✅ Anonymous header shows “Create account” + “Sign in”.
- ✅ Single Router; app renders.

## Artifacts
- Screenshot: `docs/verification/img/2025-09-20-verify.png`
- Lint/Test/Build log: `docs/verification/logs/2025-09-20-verify.log`
- Commit: `<REPLACE_WITH_GIT_SHA>`

## Notes
- Vitest smoke test: `src/__tests__/header.auth.smoke.test.jsx`
- ESLint uses warn-only for import/order to reduce noise.
