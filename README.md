# Bill Demo - Monorepo Application

A modern monorepo application with Node.js Express backend and React frontend, featuring user authentication and deployable on Vercel.

## Features

- 🔐 **User Authentication**: Register and login with JWT-based authentication
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode and animations
- 🚀 **Monorepo Structure**: Organized codebase with npm workspaces
- ☁️ **Vercel Ready**: Configured for seamless deployment on Vercel
- 🔒 **Secure**: Password hashing with bcrypt, JWT tokens
- 📱 **Responsive**: Works great on desktop and mobile devices

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

### Frontend
- React 18
- Vite
- React Router
- Axios for API calls
- Modern CSS with animations

## Project Structure

```
bill-demo/
├── backend/               # Express backend
│   ├── api/              # Vercel serverless functions
│   ├── config/           # Database configuration
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   └── server.js         # Main server file
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main app component
│   └── vite.config.js    # Vite configuration
└── package.json          # Root workspace config

```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. **Clone the repository** (or you're already in it):
   ```bash
   cd /home/user/IdeaProjects/bill-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Backend (create `backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` and update:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

   Frontend (create `frontend/.env`):
   ```bash
   cp frontend/.env.example frontend/.env
   ```

4. **Start the development servers**:

   Option 1 - Run both together:
   ```bash
   npm run dev
   ```

   Option 2 - Run separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend

   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

5. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

## Deployment on Vercel

### Prerequisites
- Vercel account
- MongoDB Atlas database (for production)

### Deploy Steps

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Set up MongoDB Atlas**:
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel**:
   - Go to your project settings in Vercel dashboard
   - Add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `NODE_ENV`: production

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Monorepo Deployment

The `vercel.json` configuration handles the monorepo structure:
- Backend is deployed as serverless functions
- Frontend is deployed as a static site
- All `/api/*` routes are proxied to the backend

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build Frontend
```bash
cd frontend
npm run build
```

## Security Notes

- Change the `JWT_SECRET` in production to a strong random value
- Use HTTPS in production
- Keep your MongoDB connection string secure
- Never commit `.env` files to version control

## License

MIT

## Author

Created with ❤️ using modern web technologies
