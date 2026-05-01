# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## Features

### Authentication & Authorization
- User signup and login with JWT tokens
- Secure password hashing with bcrypt
- Role-based access control (Admin & Member)

### Project Management
- Create and manage projects (Admin only)
- Add/remove team members to projects
- View all assigned projects

### Task Management
- Create and assign tasks to team members
- Update task status (Pending, In Progress, Completed)
- Set due dates for tasks
- Filter tasks by status
- Delete tasks (creator or admin only)

### Dashboard
- View task statistics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - In progress tasks
  - Overdue tasks

## Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

**Frontend:**
- React with Hooks
- React Router for navigation
- Axios for API calls
- CSS for styling

## Project Structure

```
Team task manager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── SignupPage.js
    │   │   ├── DashboardPage.js
    │   │   └── ProjectPage.js
    │   ├── components/
    │   │   ├── ProjectList.js
    │   │   ├── TaskStats.js
    │   │   ├── TaskForm.js
    │   │   └── TaskList.js
    │   ├── styles/
    │   │   ├── auth.css
    │   │   ├── dashboard.css
    │   │   ├── taskstats.css
    │   │   ├── projectlist.css
    │   │   ├── projectpage.css
    │   │   ├── taskform.css
    │   │   └── tasklist.css
    │   ├── api.js
    │   ├── services.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env.example
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Projects
- `POST /api/projects` - Create a new project (Admin only)
- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/add-member` - Add member to project (Admin only)
- `PUT /api/projects/remove-member` - Remove member from project (Admin only)

### Tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get tasks (with optional filters: projectId, status)
- `PUT /api/tasks/:id` - Update task status, description, or due date
- `DELETE /api/tasks/:id` - Delete a task

## Usage

### Creating an Account
1. Visit the signup page at `/signup`
2. Enter your name, email, and password
3. You'll be created as a "Member" by default

### Admin Setup (Optional)
To create an admin account:
1. Sign up normally
2. Manually update the user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "Admin" } }
)
```

### Workflow

1. **Admin creates a project:**
   - Go to Dashboard
   - Click "+ New Project"
   - Fill in project details

2. **Admin adds members:**
   - Go to project
   - In the "Project Members" section, enter member email
   - Click "Add Member"

3. **Admin creates tasks:**
   - Go to project
   - Click "+ Create Task"
   - Select team member to assign task
   - Add title, description, and due date

4. **Members update task status:**
   - Go to Dashboard
   - Click on assigned project
   - Find their tasks
   - Click "Change Status" to update

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin | Member),
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  name: String,
  description: String,
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  status: String (Pending | In Progress | Completed),
  assignedTo: ObjectId (ref: User),
  projectId: ObjectId (ref: Project),
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Backend Deployment (Railway)

1. Push code to GitHub
2. Create account on [Railway.app](https://railway.app)
3. Connect GitHub repository
4. Add environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT
   - `NODE_ENV` - Set to "production"
5. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel/Netlify with environment variables:
   - `REACT_APP_API_URL` - Backend API URL

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire in 7 days
- All protected routes require authentication
- Role-based middleware ensures proper authorization
- Input validation on all endpoints

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, allow your IP in network access

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Clear browser cache

### Tasks/Projects not loading
- Check browser console for errors
- Verify JWT token is valid
- Check backend logs

## Future Enhancements

- Task comments and notifications
- File attachments
- Task priorities
- Team collaboration features
- Email notifications
- Activity logs
- Advanced filtering and search
- Mobile app

## License

MIT

## Support

For issues or questions, please check the backend logs and browser console for error messages.
