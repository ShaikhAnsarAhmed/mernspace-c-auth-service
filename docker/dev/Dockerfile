# Use the official Node.js image as our base..node 18 version is installed..we can inherit node:18 image in our docker image.. 
FROM node:18


# Set the working directory inside the container
WORKDIR /usr/src/app


# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./


# Install app dependencies
RUN npm install


# Copy the rest of our app's source code into the container
COPY . .


# Expose the port the app will run on..5501 ku host machine per expose karna hai..
EXPOSE 5501

# above commands for image builds ony
# The command to run our app...container
CMD ["npm", "run", "dev"]
