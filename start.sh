#!/bin/bash
cd /usr/src/app
npm install
npm run compile
exec /usr/bin/supervisord
