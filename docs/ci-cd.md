# Web CI/CD

## Workflows

- `.github/workflows/ci.yml`: runs on pull requests, pushes to `main`, and manual dispatch.
- `.github/workflows/deploy.yml`: builds and deploys on pushes to `main` and manual dispatch.

## Required GitHub Configuration

Repository variables:

- `VITE_API_URL` optional. Defaults to `https://qlktx-backend-2302700155.azurewebsites.net`.

Repository secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN` required only for deploy. If missing, the deploy job exits successfully with setup instructions.

## Quality Gates

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm audit --audit-level=high`

## Production Env

The deploy workflow builds with:

```text
VITE_API_MODE=live
VITE_API_URL=${{ vars.VITE_API_URL || 'https://qlktx-backend-2302700155.azurewebsites.net' }}
```
