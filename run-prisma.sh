#!/bin/bash
export DATABASE_URL="postgresql://material_user:material_password@localhost:5432/material_db"
echo "Using DATABASE_URL: $DATABASE_URL"

# Regenerate Prisma client with the environment variable
npx prisma generate

# Run Prisma Studio
npx prisma studio
