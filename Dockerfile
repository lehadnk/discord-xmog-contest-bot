#for linux - attempts
FROM node:21.7.1-bionic
RUN apt-get update && apt-get install -y supervisor
WORKDIR /usr/src/app
CMD ["/usr/bin/supervisord"]
