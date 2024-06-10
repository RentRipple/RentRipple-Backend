# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install TypeScript globally
RUN npm install -g typescript

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to run the app
CMD ["npm","run","start"]

# Expose the port the app runs on
EXPOSE 8000