FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy files to the container
COPY . .    

# Install dependencies
RUN npm ci

# Expose the port the dev server will run on
EXPOSE 3000

# Run the Vite dev server
CMD ["npm", "run", "serve"]
