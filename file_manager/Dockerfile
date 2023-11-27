FROM node:18.12.0-alpine AS build
WORKDIR /src/app
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 80
CMD [ "npm", "start" ]