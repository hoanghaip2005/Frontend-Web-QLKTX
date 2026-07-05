# Frontend-Web-QLKTX

React web frontend base for DormCare Hub / QLKTX. Repo này dùng để nhóm dựng giao diện frontend web-responsive trước, chưa nối backend hoặc Supabase.

## Quick Start

```bash
npm install
npm run dev
```

Dev server mặc định chạy tại `http://localhost:5173`.

## Commands

| Command             | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Start Vite dev server                                    |
| `npm run build`     | Typecheck project references and build production assets |
| `npm run preview`   | Preview built app                                        |
| `npm run lint`      | Run ESLint                                               |
| `npm run typecheck` | Run TypeScript check without emit                        |
| `npm run format`    | Format files with Prettier                               |

## Architecture

- Stack: Vite + React + TypeScript + Tailwind CSS.
- Routing: `react-router-dom`.
- UI primitives: shadcn components in `src/components/ui`.
- Icons: `lucide-react` only.
- Data mode: `VITE_API_MODE=mock` (mặc định, demo offline) hoặc `live` (gọi `Backend-QLKTX` REST API qua `src/lib/api`).
- Supabase Auth thật: deferred; live mode local dùng backend `DEV_AUTH_BYPASS`.

## Live mode (backend integration)

```bash
# 1. Chạy backend + database (xem D:\QLKTX\Backend-QLKTX\README.md, mục Local Development)
# 2. Tạo .env.local:
#      VITE_API_MODE=live
#      VITE_API_URL=http://localhost:4000
npm run dev
```

Đăng nhập bằng role bất kỳ; vai trò được lưu ở `localStorage` và gửi tới backend qua header dev-bypass (chỉ dùng cho môi trường local).

## shadcn

Local shadcn CLI is installed as a dev dependency for this Windows workspace:

```bash
node ./node_modules/shadcn/dist/index.js info
node ./node_modules/shadcn/dist/index.js add <component> --yes
```

Member 1 owns `src/components/ui`, `components.json`, Tailwind tokens and dependency changes.

Docs:

- [Frontend Architecture](docs/frontend-architecture.md)
- [Team Work Rules](docs/team-work-rules.md)
- [Agent Rules](AGENTS.md)
- PM/technical snapshot docs: `docs/pm/`, copied from `D:\NGONGOCDANGKHOA\docs` by Member 1/PM

## Route Preview

- `/login`
- `/student/dashboard`
- `/staff/dashboard`
- `/admin/dashboard`

## Team Rule Short Version

- Member 1 owns app shell, router, shared UI, configs and docs.
- Members 2-7 own only their assigned feature folders.
- Members 2-7 can work from local docs, including `docs/pm/`; no clone/read of `D:\NGONGOCDANGKHOA\docs` is required.
- Do not add dependencies or backend code without coordination.
- Use shadcn components and lucide icons for new UI.
- Run `npm run typecheck`, `npm run lint` and `npm run build` before merge.
