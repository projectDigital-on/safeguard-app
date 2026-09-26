# SafeGuard - Android Parental Control MDM

A production-ready parental control web application for managing Android devices, screen time, content filtering, and location tracking.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod) via Prisma ORM
- **Auth**: NextAuth.js v4 with JWT sessions
- **UI**: Tailwind CSS + Lucide Icons + Recharts
- **State**: Zustand + React Query

## Quick Start

### 1. Prerequisites
- Node.js 20+
- Git

### 2. Clone & Install
```bash
git clone <your-repo>
cd parental-control-app
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
# Edit .env with your values (defaults work for local dev)
```

### 4. Database Setup
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed Demo Data
```bash
npm run seed
```

### 6. Start Development Server
```bash
npm run dev
```

Open **http://localhost:3000**

## Demo Account

```
Email:    demo@safeguard.com
Password: Demo1234!
```

## Features

| Feature | Status |
|---------|--------|
| ✅ Landing page | Done |
| ✅ Sign up / Login | Done |
| ✅ Dashboard overview | Done |
| ✅ Child profiles | Done |
| ✅ Screen time controls | Done |
| ✅ Location tracking | Done |
| ✅ Alerts center | Done |
| ✅ Usage reports | Done |
| ✅ Device management | Done |
| ✅ Settings | Done |

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Home overview
│   │   ├── children/         # Child profiles
│   │   ├── screen-time/      # Screen time controls
│   │   ├── location/         # GPS tracking
│   │   ├── alerts/           # Alerts center
│   │   ├── reports/          # Usage reports
│   │   ├── devices/          # Device management
│   │   └── settings/         # Account settings
│   ├── api/auth/             # NextAuth + register
│   ├── login/                # Login page
│   └── signup/               # Signup page
├── components/
│   ├── sidebar.tsx           # Navigation sidebar
│   └── header.tsx            # Page header
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── auth.ts               # NextAuth config
│   └── utils.ts              # Helper functions
└── types/
    └── next-auth.d.ts        # Session type extensions
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed demo data
npx prisma studio    # Open database UI
```

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID=""       # Optional
GOOGLE_CLIENT_SECRET=""   # Optional
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Set environment variables
3. Change DATABASE_URL to PostgreSQL (e.g., Supabase, Neon)
4. Deploy

### Update Prisma for PostgreSQL
```env
DATABASE_URL="postgresql://user:password@host:5432/db"
```
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Then re-run `npx prisma migrate dev`.
