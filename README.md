# EngTutor - English Learning Platform MVP

A full-stack MVP for connecting English students with qualified teachers for 1-on-1 lessons.

## Features

- **Authentication**: Email/password and Google OAuth with NextAuth.js
- **Role-based Access**: Students can browse teachers, teachers manage profiles
- **Teacher Profiles**: Bio, experience, hourly rates, availability
- **Booking System**: Students can book lessons with available time slots
- **Search & Filter**: Find teachers by level, price, and availability
- **Reviews & Ratings**: Post-lesson feedback system
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: React Hot Toast for notifications

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and update with your values:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Initialize database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Test Accounts

After seeding, you can use these accounts:

**Teachers**:
- sarah@example.com / password123
- michael@example.com / password123
- emma@example.com / password123

**Student**:
- student@example.com / password123

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── login/            # Authentication pages
│   ├── search/           # Teacher search
│   └── teachers/         # Teacher profiles
├── components/           # Reusable UI components
├── lib/                 # Utilities and configurations
├── prisma/              # Database schema and seed
└── types/               # TypeScript type definitions
```

## Deployment

This project is ready for deployment on Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

The SQLite database will work on Vercel for demo purposes.

## MVP Limitations

This is a demo MVP with simplified features:
- Mock video calls (Zoom links generated)
- Basic payment simulation
- Simple scheduling system
- No real-time chat (polling-based)

## Next Steps

- Real-time messaging with WebSockets
- Video call integration (WebRTC)
- Payment processing with Stripe
- Advanced scheduling with calendar sync
- Mobile app development