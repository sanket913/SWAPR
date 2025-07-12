# Swapr Platform - Next.js Version

A comprehensive skill exchange platform built with Next.js 14, React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Skill Management**: Users can offer and request skills  
- **Swap Requests**: Create, manage, and track skill exchange requests
- **Reviews & Ratings**: Rate and review skill exchange experiences
- **Notifications**: Get notified about swap requests and updates
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Server-Side Rendering**: Fast loading with Next.js SSR
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Next.js Image optimization

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Your logo file (logo.png) placed in the public directory

### 1. Environment Setup

Create a `.env.local` file in the **root directory**:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/swapr
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Important Notes:**
- The `.env.local` file should be in the root directory of the project
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Change `JWT_SECRET` to a secure random string for production

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the default URI: `mongodb://localhost:27017/swapr`
4. The database will be created automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env.local` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swapr?retryWrites=true&w=majority
   ```

### 3. Installation

**Important**: Before running the application, make sure to place your logo file:
1. Add your horizontal PNG logo file to the `public/` directory
2. Name it `logo.png`
3. Recommended dimensions: 200-300px width, 40-60px height for best results

Install all dependencies:

```bash
npm install
```

### 4. Running the Application

Start both frontend and backend:

```bash
npm run dev
```

This will start:
- Next.js frontend on http://localhost:3000
- Backend API on http://localhost:3001

### 5. Building for Production

```bash
npm run build
npm start
```

### 6. Default Admin Account

The system creates a default admin account:
- Email: admin@swapr.com
- Password: admin123

## Next.js Features Used

- **App Router**: Modern routing with layouts and nested routes
- **Server Components**: Optimized rendering performance
- **Image Optimization**: Automatic image optimization with next/image
- **TypeScript**: Full type safety throughout the application
- **CSS Modules**: Scoped styling with Tailwind CSS
- **Environment Variables**: Secure configuration management

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── Auth/          # Authentication components
│   ├── Browse/        # Browse and search components
│   ├── Profile/       # User profile components
│   ├── Swaps/         # Swap management components
│   ├── Admin/         # Admin dashboard components
│   └── Layout/        # Layout components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
└── types/             # TypeScript type definitions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all public users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/admin/all` - Admin: Get all users
- `PUT /api/users/admin/:id` - Admin: Update user
- `DELETE /api/users/admin/:id` - Admin: Delete user

### Swap Requests
- `GET /api/swaps` - Get user's swap requests
- `POST /api/swaps` - Create swap request
- `PUT /api/swaps/:id` - Update swap request
- `DELETE /api/swaps/:id` - Delete swap request
- `GET /api/swaps/admin/all` - Admin: Get all swaps

### Reviews
- `GET /api/reviews/user/:userId` - Get reviews for user
- `POST /api/reviews` - Create review
- `GET /api/reviews/given` - Get user's given reviews

### Notifications
- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/admin/announcement` - Admin: Send announcement

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`
2. **Database**: Update models in `server/models/`
3. **Frontend**: Update API service in `src/lib/api.ts`
4. **UI**: Create/update components in `src/components/`
5. **Types**: Update TypeScript types in `src/types/`

### Installing New Dependencies

```bash
# For frontend dependencies
npm install package-name

# For backend dependencies  
npm install package-name

# For development dependencies
npm install package-name --save-dev
```

## Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
- `MONGODB_URI`: Your production MongoDB connection string
- `JWT_SECRET`: A secure random string
- `NODE_ENV`: Set to "production"
- `NEXT_PUBLIC_API_URL`: Your production API URL

### Security Considerations
- Use HTTPS in production
- Set secure JWT secret
- Configure CORS properly
- Use MongoDB Atlas or secure MongoDB instance
- Implement rate limiting
- Add input validation and sanitization

## Performance Optimizations

- **Next.js Image Optimization**: Automatic image optimization and lazy loading
- **Server-Side Rendering**: Faster initial page loads
- **Code Splitting**: Automatic code splitting for optimal bundle sizes
- **Static Generation**: Pre-rendered pages where possible
- **API Route Optimization**: Efficient API endpoints

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Check network connectivity for Atlas

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser cookies if needed

3. **Next.js Build Errors**
   - Check TypeScript errors
   - Verify all imports are correct
   - Check environment variables

4. **Image Loading Issues**
   - Ensure images are in the public directory
   - Check Next.js Image component configuration
   - Verify image domains in next.config.js

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.