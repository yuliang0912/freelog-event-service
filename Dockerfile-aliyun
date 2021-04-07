FROM node:14.6.0-alpine

MAINTAINER yuliang <yu.liang@freelog.com>

RUN mkdir -p /data/freelog-contract-service

WORKDIR /data/freelog-contract-service

COPY . /data/freelog-contract-service

RUN npm install --production

ENV NODE_ENV prod
ENV EGG_SERVER_ENV prod
ENV PORT 7109
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 7109

CMD [ "npm", "start" ]
