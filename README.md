# Escape Tutorial Hell

**A simple daily tutorial / learning tracker with GitHub-style activity heatmap**

Stop jumping between tabs and forgetting what you learned.  
Log tutorials, articles, videos, and courses you complete each day. Track your progress visually and build consistent learning habits.

![Backend CI](https://github.com/stefanantohi/escape-T-hell/actions/workflows/ci-backend.yml/badge.svg)
![Frontend CI](https://github.com/stefanantohi/escape-T-hell/actions/workflows/ci-frontend.yml/badge.svg)

## Features

- **/day** — Quick form to add/edit/delete today's tutorials (URLs + title + category + time spent + notes)
- **/overview** — Beautiful GitHub-style heatmap (toggle between total time spent or number of completions)
- Click any day on the heatmap to see what you learned that day
- Supports `?date=YYYY-MM-DD` query param on the daily page
- **LocalStorage fallback** — Start using the app instantly without login
- **OAuth login** (Google + GitHub) — Persistent storage across devices
- Fully responsive design with dark mode support
- Static landing/demo page for showcasing the app

## Tech Stack

**Backend**
- FastAPI (Python 3.11)
- SQLAlchemy 2.0 + SQLite
- JWT-based authentication (ready for Google & GitHub OAuth)

**Frontend**
- React 19 + TypeScript
- Vite + pnpm
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- React Router v6
- Lucide React icons

**DevOps**
- Docker + docker-compose
- GitHub Actions CI/CD (lint, test, build)
- Multi-stage Docker builds

## Quick start

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/escape-tutorial-hell.git
   cd escape-tutorial-hell
```

2. Start with Docker Compose (recommended)
```bash
    docker compose -f docker-compose.dev.yml up --build
```

3. Open your browser:
* Frontend: http://localhost:3000
* Backend API: http://localhost:8000/docs

##  Project roadmap

- [x] monorepo + GitHub Actions CI/CD
- [x] backend models & CRUD
- [ ] react frontend
- [ ] localStorage support
- [ ] GitHub + Google OAuth
- [ ] heatmap
- [ ] docker setup
- [ ] deployment to AWS EC2

## Contributing

Feel free to open issues or PRs

## License
MIT
