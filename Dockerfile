# Root-level Dockerfile for backend deployment (e.g., on Render)
FROM node:18

WORKDIR /app

# Copy package.json for dependency install
COPY backend/package*.json ./

RUN npm install

COPY backend ./

EXPOSE 5000

CMD ["npm", "start"]
