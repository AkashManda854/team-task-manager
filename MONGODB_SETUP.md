# Quick MongoDB Atlas Setup (5 minutes)

## Why This Error Happens
The signup is failing because MongoDB database is not running. The backend can't store user data anywhere.

## Solution: MongoDB Atlas (FREE - No Credit Card)

### Step 1: Create Free Account (2 min)
```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign up"
3. Enter name, email, password
4. Check email & verify
5. You're logged in!
```

### Step 2: Create Free Database (2 min)
```
1. Click "Create" on left menu
2. Select "Build a Database"
3. Choose "M0 Sandbox" (free forever)
4. Cloud Provider: AWS
5. Region: us-east-1 (or closest to you)
6. Click "Create Cluster"
7. Wait 2-3 minutes for cluster to create...
```

### Step 3: Get Connection String (1 min)
```
1. Click "Connect" button on your cluster
2. Choose "Drivers"
3. Select "Node.js"
4. Copy the connection string
5. It looks like:
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

### Step 4: Update Your Backend (1 min)
```
1. Open: backend/.env
2. Replace this line:
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority
   
   With YOUR connection string from Step 3
   
3. Important: Replace "myFirstDatabase" with "team-task-manager"
```

### Step 5: Restart Backend
```
1. Stop the backend (Ctrl+C)
2. Run: npm start
3. You should see: "MongoDB connected successfully"
```

---

## Safety Tips
- Add your IP to whitelist (Atlas will ask)
- Create database user credentials
- Change password to something secure
- Keep credentials private

## Testing After Setup
1. Go to http://localhost:3000/signup
2. Fill in the form
3. Click "Sign Up"
4. You should be redirected to Dashboard!

---

## Troubleshooting

### Still getting "Signup failed"?
```
1. Check backend logs (look for "MongoDB connected")
2. Verify IP whitelist in Atlas (click Network Access)
3. Try restarting backend
4. Check connection string has no typos
```

### "Authentication Failed"
```
- Your password has special characters
- Enclose connection string in quotes
- Example: MONGODB_URI="mongodb+srv://user:pass@..."
```

### "Too Many Requests"
```
- You might be rate limited
- Wait a few minutes
- Create new Atlas user account
```

---

## Alternative: Local MongoDB (Advanced)
If you want MongoDB locally instead of Atlas:

### Windows - Download & Install:
```
1. Go to: https://www.mongodb.com/try/download/community
2. Download "Community Server" for Windows
3. Run installer, follow prompts
4. It installs at: C:\Program Files\MongoDB\Server\7.0
5. To run MongoDB:
   - Option A: It runs as Windows Service automatically
   - Option B: Open cmd and run: "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
6. Backend .env should be:
   MONGODB_URI=mongodb://localhost:27017/team-task-manager
```

### Verify MongoDB is Running:
```
Open new cmd window and type:
mongo

You should see MongoDB shell prompt (>)
```

---

## Recommended: Atlas (Most Reliable)
- No installation needed
- Free tier generous (512MB storage)
- Automatically backed up
- Accessible from anywhere
- Perfect for learning & testing

Choose Option 1 (MongoDB Atlas) if unsure!
