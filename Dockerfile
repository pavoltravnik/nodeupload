FROM node:lts-alpine

USER node
WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]