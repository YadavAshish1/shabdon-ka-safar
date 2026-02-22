# Shabdon Ka Safar - Learning Platform

A comprehensive web application for managing and delivering educational content to students. This platform allows administrators to create and organize content by class, and students can access personalized learning materials based on their class and interact in a community forum.

## Features

### Admin Features
- **Dashboard**: Overview of classes, chapters, topics, students, and community posts
- **Class Management**: Create and manage classes (5th, 6th, SSC Prep, GK, etc.)
- **Chapter Management**: Organize content into chapters within classes
- **Topic Management**: Create rich text content for each topic using a WYSIWYG editor
- **Community Moderation**: View all community posts and discussions

### Student Features
- **Personalized Dashboard**: View content based on assigned class
- **Class-wise Content**: Browse classes, chapters, and topics
- **Rich Content Reading**: Read formatted content with proper styling
- **Community Forum**: Ask questions and reply to discussions
- **User Profile**: Sign up with class and date of birth information

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Rich Text Editor**: React Quill
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="admin123"
   ADMIN_NAME="Admin User"
   ```

3. **Initialize the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Create admin user**:
   ```bash
   npx ts-node scripts/init-admin.ts
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

- **Email**: admin@example.com (or as set in `.env`)
- **Password**: admin123 (or as set in `.env`)

⚠️ **Important**: Change the default admin password after first login!

## Project Structure

```
shabdon-ka-safar/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── student/        # Student pages
│   ├── api/            # API routes
│   ├── login/           # Login page
│   └── signup/          # Signup page
├── components/
│   ├── admin/          # Admin components
│   ├── community/      # Community components
│   ├── layouts/        # Layout components
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions and configurations
├── prisma/             # Database schema
└── scripts/            # Utility scripts
```

## Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **Create Classes**: Go to Classes section and create classes for different levels
3. **Add Chapters**: Create chapters within each class
4. **Create Topics**: Add topics with rich text content using the editor
5. **Monitor Community**: View all community posts and discussions

### For Students

1. **Sign Up**: Create an account with your class and date of birth
2. **Login**: Access your personalized dashboard
3. **Browse Content**: Navigate through classes, chapters, and topics
4. **Read Materials**: Read formatted content for each topic
5. **Participate in Community**: Ask questions and help others

## Database Management

- **View database**: `npm run db:studio`
- **Reset database**: Delete `prisma/dev.db` and run `npx prisma db push`

## Production Deployment

Before deploying to production:

1. Change `NEXTAUTH_SECRET` to a secure random string
2. Update `DATABASE_URL` to use PostgreSQL or another production database
3. Update `NEXTAUTH_URL` to your production domain
4. Change admin credentials
5. Run database migrations: `npx prisma migrate deploy`

## License

This project is open source and available under the MIT License.
