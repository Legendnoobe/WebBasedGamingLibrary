# Build stage for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Final stage for backend
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend/ ./backend/

# Copy frontend build output to backend public dir (if serving static)
# Alternatively, use Nginx for frontend, but for self-hosting simplification:
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Environment variables
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "backend/index.js"]
