#Final Architecture

                 College WiFi / LAN
                        |
     ------------------------------------------------
     |              |              |               |
    Principal     Accounts 1    Accounts 2    Admission
    Laptop        Laptop        Laptop        Laptop
                            |
                      Admin Laptop
                (Main ERP Server)
                Node.js + MongoDB

The Admin Laptop becomes the server.

Step 1: Prepare Main ERP Laptop

Install:

    Node.js
    node -v
    npm -v
MongoDB Community Server

Download:

MongoDB Community Server

Verify:

    mongod --version
Step 2: Build Frontend

Inside frontend:

    npm install
    npm run build

Creates:

    dist/
Step 3: Configure Backend

    Backend .env

    PORT=5000
    
    MONGO_URI=mongodb://localhost:27017/mkd_erp

    JWT_SECRET=mkd_super_secret_key
    
Step 4: Start MongoDB

MongoDB service:

net start MongoDB

or

    mongod
Step 5: Start Backend

    cd backend
    
    npm install
    
    npm start

Should show:

    MongoDB Connected
    Server running on port 5000
    
Step 6: Serve React Build

Simplest method:

Install:

    npm install -g serve

Inside frontend:

    serve -s dist -l 3000

Now:

    http://localhost:3000

works on server laptop.

Step 7: Find Local IP

On Admin Laptop:

    ipconfig

Example:

IPv4 Address

    192.168.1.105
    
Step 8: Update Frontend API URL

Current:

    baseURL: "http://localhost:5000/api"

Change:

    baseURL: "http://192.168.1.105:5000/api"

Rebuild:

    npm run build
    
Step 9: Allow Firewall

Open:

    Windows Defender Firewall

Allow:

    Node.js
    Port 5000
    Port 3000

Or:

    New-NetFirewallRule -DisplayName "MKD ERP Backend" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
    
    New-NetFirewallRule -DisplayName "MKD ERP Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow

Step 10: Access from Other Laptops

Open browser:

    http://192.168.1.105:3000

Login normally.

All users use the same database.

Step 11: Auto Start After Restart

MongoDB

Windows service already starts.

Backend

Use:

    npm install -g pm2

Start:

    pm2 start src/server.js --name mkd-backend

    pm2 save

    pm2 startup

Frontend

    pm2 serve dist 3000 --name mkd-frontend --spa

Save:

    pm2 save

Step 12: Daily Backup

Create:

    mongodump --db mkd_erp --out D:\ERP_Backups

Schedule using:

    Windows Task Scheduler

Daily:

    8 PM
Step 13: Recovery

Restore:

    mongorestore D:\ERP_Backups
    
Your Final Production Setup

    Admin Laptop
    -------------------
    MongoDB
    Node Backend
    React Frontend
    PM2
    
    Principal Laptop
    -------------------
    Browser Only
    
    Admission Laptop
    -------------------
    Browser Only
    
    Accounts Laptop 1
    -------------------
    Browser Only
    
    Accounts Laptop 2
    -------------------
    Browser Only
