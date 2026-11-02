#!/usr/bin/env bash
set -e

echo "Starting containers..."
docker compose up -d

echo "Waiting for Gitea..."
until curl -sf http://localhost:3001/api/healthz > /dev/null; do sleep 2; done

echo "Creating Gitea admin user..."
docker compose exec -u git gitea gitea admin user create --admin \
  --username testadmin --password 'TestAdmin123!' \
  --email testadmin@example.com --must-change-password=false \
  || echo "Admin user already exists"

echo "Waiting for Juice Shop..."
until curl -sf http://localhost:3000 > /dev/null; do sleep 2; done

echo "Environment is ready."