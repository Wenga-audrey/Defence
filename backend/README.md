# Mindboost Backend API

Backend API for Mindboost - an adaptive learning system for Cameroonian national exams.

## 🚀 Quick Start

### Automatic Setup (Recommended)

Just run one command and everything will be set up automatically:

```bash
npm run dev
```

This will:

- ✅ Generate Prisma client
- ✅ Run database migrations
- ✅ Start the development server
- 🎯 API available at `http://localhost:3001`

### Alternative Commands

```bash
# Fresh start (reset database with sample data)
npm run dev:fresh

# Production build and start
npm run build
npm run start

# Database operations
npm run db:setup     # Setup database
npm run db:reset     # Reset with sample data
npm run db:studio    # Open Prisma Studio
```

## 🔑 Demo Credentials

After running `npm run dev`, you can login with:

- `GET /api/analytics/courses/:courseId` - Course analytics

### Admin Panel

- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/courses` - Manage courses
- `POST /api/admin/notifications/broadcast` - Send notifications
- `GET /api/admin/export/users` - Export user data

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Student, instructor, and admin accounts
- **Courses**: Educational content organized by exam type and level
- **Lessons**: Individual learning units within courses
- **Assessments**: Quizzes and tests with adaptive capabilities
- **Enrollments**: User course registrations and progress
- **Learning Paths**: Personalized study schedules
- **Subscriptions**: Payment and access management
- **Analytics**: Progress tracking and performance data

## 🔐 Authentication & Security

- JWT tokens for stateless authentication
- Role-based access control (Student, Instructor, Admin)
- Password hashing with bcrypt
- Rate limiting for API endpoints
- Input validation with Zod schemas
- CORS configuration for cross-origin requests

## 🎯 Key Features for Mindboost Business Plan

### Adaptive Learning System

- AI-powered content recommendations based on user performance
- Personalized learning paths optimized for exam preparation
- Dynamic difficulty adjustment in assessments

### Exam Preparation Focus

- Support for Cameroonian national exams (ENAM, ENS, Police, Customs)
- Structured content aligned with official syllabi
- Performance tracking specific to exam requirements

### Subscription Model

- Multiple pricing tiers (Free, Monthly, Annual, Lifetime)
- Feature-based access control
- Payment integration ready (Stripe webhook support)

### Analytics & Insights

- Detailed progress tracking and performance analytics
- Study time optimization recommendations
- Weakness identification and targeted improvement

## 🧪 Demo Data

The seed script creates demo accounts for testing:

- **Admin**: `admin@mindboost.com` / `admin123`
- **Instructor**: `instructor@mindboost.com` / `instructor123`
- **Student**: `student@mindboost.com` / `student123`

## 🚀 Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

4. **Start the production server**
   ```bash
   npm start
   ```

## 🔧 Development Tools

- **Prisma Studio**: Visual database browser

  ```bash
  npm run db:studio
  ```

- **Database Reset**: Reset and reseed database
  ```bash
  npm run db:push
  npm run db:seed
  ```

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

Error responses:

```json
{
  "error": "Error message",
  "details": [ ... ] // For validation errors
}
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Prisma for all database operations
3. Implement proper error handling
4. Add input validation for all endpoints
5. Include appropriate authentication checks
6. Write descriptive commit messages

## 📄 License

This project is proprietary software for the Mindboost learning platform.
