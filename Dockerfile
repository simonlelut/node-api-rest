FROM node:alpine

WORKDIR /home/node-api-rest
COPY . /home/node-api-rest

RUN npm install

EXPOSE 3000

CMD ["npm","run", "start"]