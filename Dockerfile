FROM node:12.16.3
WORKDIR /usr/src/
COPY package*.json ./

RUN npm install -g @angular/cli@9.1.4
RUN npm install

RUN cd ../
COPY . .
EXPOSE $PORT 

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN if [ "$NODE_ENV" = "prd" ] ; then ng build --prod ; else ng build ; fi

CMD ["node", "./server/server.js"]