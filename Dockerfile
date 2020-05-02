FROM node:12.16.3
WORKDIR /usr/src/
COPY package*.json ./

RUN npm install -g @angular/cli@9.1.4
RUN npm install

RUN cd ../
COPY . .
EXPOSE 8080
CMD ["ng", "build"]
CMD ["node", "./server/server.js"]
