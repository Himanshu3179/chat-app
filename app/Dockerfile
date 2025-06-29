FROM node:20-alpine

WORKDIR /app

# --- Frontend Setup and Build ---
WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

# --- Backend Setup and Build ---
WORKDIR /app/backend
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install
COPY ./backend .
RUN npm run build

# --- Final Configuration and Run Command ---
# Navigate back to the root of your application in the container
WORKDIR /app

# The frontend dist is already within /app/frontend/dist from the build step
# The backend dist is already within /app/backend/dist from the build step

# Set NODE_ENV to production for the backend
ENV NODE_ENV=production

# Expose port 80, as your backend is configured to listen on it in production
EXPOSE 80

# Command to start the backend server
# This assumes your backend's package.json has a "start" script
# like "start": "node dist/server.js"
CMD ["npm", "start", "--prefix", "backend"]
