# Use an official Node.js 21.7.1 image based on Debian Bullseye
FROM node:21.7.1-bullseye-slim

# Install Python 3.11.1 and necessary build tools
RUN apt-get update && apt-get install -y supervisor
#    python3 \
#    python3-dev \
#    python3-pip \
#    build-essential \
#    supervisor \
#    && ln -sf /usr/bin/python3 /usr/bin/python \
#    && apt-get clean \
#    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy your application files to the container
#COPY . .
#COPY ./migrations ./migrations
#COPY ./src ./src

# Install npm packages
#RUN npm install
#RUN npm rebuild
#RUN npm run compile

#COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN sudo chown docker /usr/src/app/prod-db.db3

CMD ["/usr/bin/supervisord"]