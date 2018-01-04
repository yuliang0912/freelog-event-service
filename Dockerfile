FROM daocloud.io/node:8.5-alpine

MAINTAINER yuliang <yu.liang@freelog.com>

RUN mkdir -p /data/freelog-event-service

WORKDIR /data/freelog-event-service

COPY . /data/freelog-event-service

RUN npm install

ENV EGG_SERVER_ENV prod
ENV PORT 7010

EXPOSE 7010

CMD [ "npm", "start" ]