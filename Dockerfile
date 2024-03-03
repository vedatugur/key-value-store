# Base the image on Node.js
FROM node:18

# Create a directory to hold the application code
WORKDIR /src

# Copy the package.json (and package-lock.json if available) to install application dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local src directory files to the container's /src directory.
# This copies the contents of ./src/* to /src/ in the container
COPY src/ .

# Copy the public folder.
COPY public/ /src/public/

# Specify the port the application listens on
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
