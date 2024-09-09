#!/bin/bash

source ~/.bashrc

cd /srv
npm run build
pm2 delete all
pm2 start npm --name "next-app" -- start
pm2 save