FROM node:10.12-alpine
RUN mkdir /src
WORKDIR /src
COPY ./package.json /src/package.json
RUN npm install --silent
COPY . .
EXPOSE 3000
CMD npm run dev