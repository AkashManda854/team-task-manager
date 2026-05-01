# Team Task Manager - Docker Setup (Optional)

If you want to run the application using Docker, follow these instructions.

## Docker Files Provided

### Backend Dockerfile
```dockerfile
FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:16 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Manual Setup (Without Pre-made Dockerfiles)

If the Dockerfiles don't exist, create them manually:

### Step 1: Create Backend Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Step 2: Create Frontend Dockerfile
Create `frontend/Dockerfile`:
```dockerfile
FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Create nginx.conf for Frontend
Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:5000;
    }
}
```

### Step 4: Create docker-compose.yml
Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: team-task-manager-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: team-task-manager-backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/team-task-manager?authSource=admin
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - mongodb
    networks:
      - team-task-manager-network

  frontend:
    build: ./frontend
    container_name: team-task-manager-frontend
    ports:
      - "80:80"
    environment:
      REACT_APP_API_URL: http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - team-task-manager-network

volumes:
  mongodb_data:

networks:
  team-task-manager-network:
    driver: bridge
```

## Running with Docker

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

### Starting the Application

```bash
# From root directory
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Accessing the Application
- Frontend: http://localhost
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

### Stopping the Application

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Rebuild Specific Service

```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

## Database Backup with Docker

### Backup MongoDB
```bash
docker exec team-task-manager-mongodb mongodump --username admin --password password --authenticationDatabase admin --archive > backup.archive
```

### Restore MongoDB
```bash
docker exec -i team-task-manager-mongodb mongorestore --username admin --password password --authenticationDatabase admin --archive < backup.archive
```

## Troubleshooting Docker

### Container won't start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild
docker-compose up -d --build --force-recreate
```

### Port already in use
```bash
# Change ports in docker-compose.yml
# Or kill existing process on that port
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb
```

## Production Deployment with Docker

### Build Production Images
```bash
docker build -t team-task-manager-backend:1.0 ./backend
docker build -t team-task-manager-frontend:1.0 ./frontend
```

### Push to Docker Hub
```bash
docker tag team-task-manager-backend:1.0 yourusername/team-task-manager-backend:1.0
docker push yourusername/team-task-manager-backend:1.0

docker tag team-task-manager-frontend:1.0 yourusername/team-task-manager-frontend:1.0
docker push yourusername/team-task-manager-frontend:1.0
```

### Deploy to Server
```bash
# On server, create production docker-compose.yml
# Pull images and start
docker-compose -f docker-compose.prod.yml up -d
```

## Docker Hub Deployment

1. Sign up at docker.io
2. Tag images with Docker Hub username
3. Push images
4. Deploy from Docker Hub

```bash
docker pull yourusername/team-task-manager-backend:1.0
docker run -d -p 5000:5000 yourusername/team-task-manager-backend:1.0
```

## Notes

- MongoDB credentials in docker-compose are for development only
- Change secrets for production deployments
- Use environment variables from .env files
- Consider using Docker Swarm or Kubernetes for production
