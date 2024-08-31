#for linux - attempts
FROM node:21.7.1
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
CMD ["/usr/bin/supervisord"]
