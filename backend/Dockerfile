# Production-ready Dockerfile for Node.js Express backend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "index.js"]
