# Task Manager (Next.js)

## Database setup

The app now stores tasks in a database using Prisma.

```bash
cp .env.example .env
npm run db:generate
npm run db:push
```

Default local database:
- `DATABASE_URL="file:./dev.db"`

## Run the app

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Where data is stored when hosted

- Data is stored in the database configured by `DATABASE_URL`.
- For deployment, set `DATABASE_URL` to a managed database (for example PostgreSQL on Neon, Supabase, Railway, or Render).
- Your app will read/write tasks to that hosted database via `/api/tasks` endpoints.

## Stop the app

Press `Ctrl + C` in the terminal running `npm run dev`.
