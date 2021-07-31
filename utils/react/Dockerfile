FROM node:14.5.0

WORKDIR /app

COPY ./watchmen/package.json /app/

COPY ./watchmen/* /app/

RUN npm install

ENV PATH ./node_modules/.bin/:$PATH
