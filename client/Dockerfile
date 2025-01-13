# Use Node.js 20 image as the base
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the client folder into the container
COPY package.json /app/
COPY package-lock.json /app/

# Install the dependencies for the client (Next.js)
RUN npm install

# Copy the rest of the client code into the container
COPY . /app

# Build the Next.js project
RUN npm run build

# Expose the port that Next.js will run on
EXPOSE 8000

# Start the Next.js application
CMD ["npm", "start"]
