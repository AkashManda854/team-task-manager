# Quick Start Guide for Team Task Manager

## Prerequisites
- Node.js (v14+)
- MongoDB installed locally OR MongoDB Atlas account
- Git

## Setup Instructions

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# On Windows (if installed)
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update backend/.env with the connection string

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (already provided with defaults)
# If you need to modify it, edit backend/.env

# Start the server
npm start
```

Server will run on: `http://localhost:5000`

You should see: "MongoDB connected successfully" and "Server running on port 5000"

### 3. Frontend Setup (New Terminal/Tab)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will open at: `http://localhost:3000`

## Testing the Application

### 1. Create Account
- Go to http://localhost:3000/signup
- Sign up with name, email, and password

### 2. Admin Account (Optional)
To test admin features:
- MongoDB Compass or Atlas UI:
  - Find your user in the "users" collection
  - Change "role" from "Member" to "Admin"
  - Refresh the app

### 3. Test Workflow
- **As Admin:**
  - Create a new project
  - Add team members (use other user emails)
  - Create tasks and assign to members

- **As Member:**
  - View assigned projects
  - View assigned tasks
  - Update task status (Pending → In Progress → Completed)

## Default Ports
- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB (local): `mongodb://localhost:27017`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- Ensure MongoDB is running (mongod on Windows)
- Check MONGODB_URI in .env is correct
- For Atlas: Check IP whitelist

**"Cannot find module"**
- Run: `npm install` in backend folder
- Delete node_modules and package-lock.json, then reinstall

### Frontend Issues

**"Cannot reach backend"**
- Ensure backend is running on port 5000
- Check .env file has correct API_URL
- Check browser console (F12) for errors

**"Login not working"**
- Verify user exists in MongoDB
- Check network tab in DevTools for API response
- Verify JWT token is being saved in localStorage

## File Structure Created

```
Team task manager/
├── README.md                 # Main documentation
├── QUICKSTART.md             # This file
├── backend/
│   ├── .env                  # Environment variables
│   ├── .env.example          # Example env file
│   ├── server.js             # Main server file
│   ├── package.json          # Dependencies
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/               # Database schemas
│   ├── controllers/          # Business logic
│   ├── routes/               # API routes
│   └── middleware/           # Auth & role middleware
└── frontend/
    ├── .env.example          # Example env file
    ├── package.json          # Dependencies
    ├── public/
    │   └── index.html        # HTML template
    └── src/
        ├── pages/            # React pages
        ├── components/       # React components
        ├── styles/           # CSS files
        ├── services.js       # API service layer
        ├── api.js            # Axios configuration
        ├── App.js            # Main App component
        └── index.js          # React entry point
```

## Next Steps

1. **Development:**
   - Make changes to backend/frontend
   - Backend will auto-reload with `npm run dev`
   - Frontend auto-reloads in browser

2. **Deployment:**
   - See README.md for deployment instructions to Railway/Vercel

3. **Database:**
   - Use MongoDB Compass to view data
   - Monitor collections: users, projects, tasks

## Common Commands

```bash
# Backend
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)

# Frontend
npm start          # Start dev server
npm build          # Create production build

# Full startup (from root, in two terminals)
Terminal 1: cd backend && npm start
Terminal 2: cd frontend && npm start
```

## Sample Test Users

After signup, you can create:
- User 1: Admin (change role in MongoDB)
- User 2: Member
- User 3: Member

Test creating projects and assigning tasks!

## Support

- Check README.md for full documentation
- Review error messages in browser console (F12)
- Check backend terminal for server errors
- Verify MongoDB is connected

Enjoy using Team Task Manager! 🚀
