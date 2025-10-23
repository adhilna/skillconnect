#!/bin/bash
set -e

git config --global --add safe.directory /home/ubuntu/skillconnect

sudo chown -R ubuntu:ubuntu /home/ubuntu/skillconnect
sudo chmod -R 755 /home/ubuntu/skillconnect

cd /home/ubuntu/skillconnect
git pull origin main

cd /home/ubuntu/skillconnect/backend
/home/ubuntu/skillconnect/backend/venv/bin/python manage.py migrate


sudo systemctl restart daphne
sudo systemctl restart celery
sudo systemctl reload nginx

echo "Deployment successful!"
