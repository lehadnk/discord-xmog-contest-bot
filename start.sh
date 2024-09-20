#!/bin/bash

# Navigate to the app directory
cd /usr/src/app

# Install dependencies
npm install

# Compile the project
npm run compile

# Start supervisord
exec /usr/bin/supervisord
