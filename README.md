# Swapr Platform with MongoDB Integration

A comprehensive skill exchange platform built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Skill Management**: Users can offer and request skills
- **Swap Requests**: Create, manage, and track skill exchange requests
- **Reviews & Ratings**: Rate and review skill exchange experiences
- **Real-time Notifications**: Get notified about swap requests and updates
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Advanced Features**: Gamification, AI matching, video calls, and more

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Leaflet for maps
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Your logo file (logo.png) placed in the public directory

### 1. Environment Setup

Create a `.env` file in the **root directory** (not in the server folder):

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/Swapr
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
```

**Important Notes:**
- The `.env` file should be in the root directory of the project (same level as package.json)
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Change `JWT_SECRET` to a secure random string for production

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the default URI: `mongodb://localhost:27017/Swapr`
4. The database will be created automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Swapr?retryWrites=true&w=majority
   ```

#### Option C: MongoDB Docker (Alternative)
If you prefer using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```
Then use: `MONGODB_URI=mongodb://localhost:27017/Swapr`

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/Swapr` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-change-this` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `VITE_API_URL` | Frontend API endpoint | `http://localhost:3001/api` |

### 3. Installation

**Important**: Before running the application, make sure to place your logo file:
1. Add your horizontal PNG logo file to the `public/` directory
2. Name it `logo.png`
3. Recommended dimensions: 200-300px width, 40-60px height for best results

Install all dependencies from the root directory:

```bash
# Install all dependencies (frontend and backend)
npm install
```

### 4. Running the Application

Start both frontend and backend:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:3001

### 5. Default Admin Account

The system creates a default admin account:
- Email: admin@Swapr.com
- Password: admin123

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

## Database Schema

### User Model
- Personal information (name, email, location)
- Skills offered and wanted
- Availability and preferences
- Gamification data (points, badges, level)
- Admin status and permissions

### SwapRequest Model
- Participants (from/to users)
- Skills being exchanged
- Status tracking
- Meeting details and terms

### Review Model
- Swap request reference
- Ratings and feedback
- Detailed skill assessments

### Notification Model
- User-specific notifications
- Type-based categorization
- Read status tracking

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes/`
2. **Database**: Update models in `server/models/`
3. **Frontend**: Update API service in `src/services/api.ts`
4. **UI**: Create/update components in `src/components/`

### Installing New Dependencies

All dependencies are now managed from the root `package.json`. To add new dependencies:

```bash
# For frontend dependencies
npm install package-name

# For backend dependencies  
npm install package-name

# For development dependencies
npm install package-name --save-dev
```

### Database Migrations

The application uses Mongoose schemas with automatic validation. Schema changes are applied automatically when the server starts.

## Production Deployment

### Environment Variables
Set these in production:
- `MONGODB_URI`: Your production MongoDB connection string
- `JWT_SECRET`: A secure random string
- `NODE_ENV`: Set to "production"

### Security Considerations
- Use HTTPS in production
- Set secure JWT secret
- Configure CORS properly
- Use MongoDB Atlas or secure MongoDB instance
- Implement rate limiting
- Add input validation and sanitization

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity for Atlas

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage if needed

3. **API Errors**
   - Check server logs
   - Verify API endpoints
   - Check request headers and body

### Logs
- Server logs: Check console output
- Frontend errors: Check browser console
- Database queries: Enable Mongoose debug mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.