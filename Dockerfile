#for linux - attempts
FROM node:21.7.1-bullseye
RUN apt-get update && apt-get install -y supervisor

RUN apt-get update && apt-get install -y \
    supervisor \
    python3 \
    python3-pip \
    make \
    g++ \
    libsqlite3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
CMD ["/usr/bin/supervisord"]
