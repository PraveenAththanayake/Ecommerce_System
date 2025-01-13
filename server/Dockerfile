# Use the latest version of the Node.js image as the base image
FROM node:latest

# Set the working directory inside the container to /usr/src/app
WORKDIR /usr/src/app

# Copy the contents of the local "server" directory to the root directory of the container
COPY . .

# Install all dependencies, including devDependencies
RUN npm install

# Install ts-node globally
RUN npm install -g ts-node

# Install nodemon globally
RUN npm install -g nodemon

# Expose port 3000 to allow incoming connections to the container
EXPOSE 3000

# Start the application by running the "npm start" command
CMD ["npm", "start"]
