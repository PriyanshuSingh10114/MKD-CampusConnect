# Production Deployment Guide

## Prerequisites
- A Linux Server (Ubuntu 22.04 LTS recommended)
- Docker and Docker Compose installed
- Domain name mapped to server IP
- (Optional but recommended) External Managed PostgreSQL Database (e.g. AWS RDS)
- (Optional but recommended) External S3 Bucket for storage

## Steps for Deployment

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd college-erp
   ```

2. **Configure Environment Variables**
   In the `backend` directory, create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   JWT_SECRET=your_secure_random_string
   PORT=5000
   ```
   *Note: If using Docker Compose's built-in DB, keep the default URL provided in `docker-compose.yml`.*

3. **Start the Infrastructure**
   Build and start all containers in detached mode:
   ```bash
   docker-compose up -d --build
   ```

4. **Run Database Migrations**
   Execute Prisma migrations inside the backend container to setup schemas:
   ```bash
   docker exec -it college-erp-backend npx prisma db push
   # Alternatively, if using migrations: npx prisma migrate deploy
   ```

5. **Setup Reverse Proxy & SSL (Recommended)**
   If you want to expose this on port 443 with HTTPS, setup a global NGINX or Traefik proxy on the host machine that points to the `college-erp-frontend` container running on port 80.

## Maintenance Commands
- View logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Stop services: `docker-compose down`
