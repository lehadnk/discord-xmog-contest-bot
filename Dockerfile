FROM node:21.7.1-bullseye-slim
RUN apt-get update && apt-get install -y supervisor
WORKDIR /usr/src/app
CMD ["/usr/bin/supervisord"]
