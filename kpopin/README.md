# KPOPIN 🎵

A social media platform for K-Pop fans. Live updates, Reddit-style discussions, group personalization, and fan-to-fan messaging.

## Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | Next.js 14 (App Router)     |
| Backend   | Next.js API Routes          |
| Database  | PostgreSQL (Docker)         |
| ORM       | Prisma                      |
| Auth      | NextAuth.js v5              |
| Styling   | Tailwind CSS                |
| Realtime  | Polling (Socket.io-ready)   |

## Features

- ✅ Register with K-pop group selection (personalised feed)
- ✅ Reddit-style upvote/downvote on posts and comments
- ✅ Threaded comments (nested replies)
- ✅ Group pages with follow/unfollow
- ✅ Fan discovery — chat with fans who share your groups
- ✅ Direct messaging
- ✅ Trending posts feed
- ✅ Explore / search
- ✅ Notifications
- ✅ Profile pages

---

## Setup

### 1. Prerequisites

- Node.js 18+
- Docker Desktop running

### 2. Clone & install

```bash
cd kpopin
npm install
```

### 3. Start the database

```bash
cd docker
docker compose up -d
cd ..
```

### 4. Set environment variables

The `.env.local` file is already pre-filled for local dev:

```
DATABASE_URL="postgresql://kpopin:kpopin_secret@localhost:5432/kpopin"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
```

Change `NEXTAUTH_SECRET` to any random string in production.

### 5. Push database schema & seed

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

This creates all tables and seeds 12 popular K-pop groups (BTS, BLACKPINK, TWICE, aespa, NewJeans, etc.)

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Usage

1. **Register** at `/auth/register` — pick your favourite groups in step 2
2. Your **feed** shows posts from groups you follow
3. Browse **Groups** to follow more
4. **Explore** to search all posts
5. **Trending** shows hottest posts of the week
6. **Messages** — discover fans with similar taste and DM them

---

## Database Studio

To browse your data visually:

```bash
npm run db:studio
```

---

## Production Notes

- Add a `password` field to the `User` model (currently demo uses `bio` field to store bcrypt hash)
- Add `GOOGLE_CLIENT_ID` / `DISCORD_CLIENT_ID` to `.env.local` for OAuth login
- Replace polling in chat with Socket.io for true real-time messaging
- Add image upload via Cloudinary or S3
- Set `NEXTAUTH_SECRET` to a strong random value

---

## Project Structure

```
src/
  app/
    (app)/          # Authenticated pages (feed, groups, chat, etc.)
    auth/           # Login & register pages
    api/            # API routes
  components/
    feed/           # PostCard, CommentSection, CreatePost
    groups/         # GroupCard, GroupFollowButton
    chat/           # ChatLayout
    layout/         # Sidebar, RightSidebar, Providers
  lib/
    prisma.ts       # DB client
    auth.ts         # NextAuth config
    utils.ts        # Helpers
prisma/
  schema.prisma     # Full data model
  seed.ts           # K-pop groups seed data
docker/
  docker-compose.yml
```
