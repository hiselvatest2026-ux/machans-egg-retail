FROM node:18

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy build folder
COPY build/ ./build

EXPOSE 3000

# Serve React build
CMD ["serve", "-s", "build", "-l", "3000"]
