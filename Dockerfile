FROM node:alpine

WORKDIR /home/node-api-rest
COPY . /home/node-api-rest


ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production
RUN npm i typescript@3.1.6 pm2 -g --production
RUN tsc

EXPOSE 3000

# Show current folder structure in logs
RUN ls

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]