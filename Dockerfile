FROM node:20

# Install build dependencies
WORKDIR /app

COPY server/package.json /app/
COPY server/package-lock.json /app/

# Install dependencies and rebuild bcrypt for the container environment
RUN npm install --build-from-source

COPY server /app

EXPOSE 3000
CMD ["npm", "start"]
