#for linux - attempts
FROM node:18-bullseye
RUN apt-get update && apt-get install -y supervisor

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    make \
    g++ \
    supervisor \
    libsqlite3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

RUN npm install
RUN npm run compile

CMD ["/usr/bin/supervisord"]
