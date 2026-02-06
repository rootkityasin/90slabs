# 90sLabs - Software Agency Portfolio

A portfolio website for 90sLabs software agency built with Next.js and MongoDB Atlas.

## Tech Stack

- Next.js 16.1.1
- React 18.2.0
- TypeScript 5
- Tailwind CSS 4
- MongoDB 7.0.0
- GSAP 3.14
- Lucide React

## Requirements

- Node.js >= 20.9.0
- MongoDB Atlas account

## Setup

1. Clone the repository

```bash
git clone https://github.com/rootkityasin/90sx.git
cd 90sx
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp env.example.txt .env.local
```

4. Add your credentials to `.env.local`

```
MONGODB_URI=your_mongodb_connection_string
ADMIN_SECRET_KEY=your_admin_api_key
```

5. Seed the database (first time only)

```bash
MONGODB_URI="your_connection_string" npx tsx scripts/seed.ts
```

6. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/
│   │   ├── admin/       # Protected CRUD endpoints
│   │   ├── services/    # Public API
│   │   ├── projects/
│   │   ├── members/
│   │   ├── hero/
│   │   ├── about/
│   │   └── contact/
│   └── page.tsx         # Main page
├── components/          # React components
├── lib/
│   ├── mongodb.ts       # Database connection
│   └── auth.ts          # Authentication utilities
└── middleware.ts        # Security headers
```

## Admin Panel

Access at `/admin`. Requires API key set in environment.

Features:

- Manage projects (add/edit/delete)
- Manage team members with image upload
- Manage services by category
- Edit hero section content
- Edit about section content

## Security

- API key authentication for admin routes
- Rate limiting (30 requests/minute)
- Security headers (CSP, XSS, clickjacking protection)
- Input validation and sanitization
- No caching on admin pages
- HSTS in production

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```

## Database Collections

- services - Service categories and items
- projects - Portfolio projects
- members - Team members
- hero - Hero section content
- about - About section content

## Deployment

Works with Vercel or any Node.js hosting. Set environment variables in your hosting dashboard.

## License

Private
