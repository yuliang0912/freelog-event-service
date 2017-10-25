FROM daocloud.io/node:8.1.2

MAINTAINER yuliang <yuliang@ciwong.com>

RUN mkdir -p /data/freelog-event-service

WORKDIR /data/freelog-event-service

COPY . /data/freelog-event-service

RUN npm install

#ENV
#VOLUME ['/opt/logs','/opt/logs/db','/opt/logs/koa','/opt/logs/track']

ENV NODE_ENV production
ENV PORT 7010

EXPOSE 7010

CMD [ "npm", "start" ]
