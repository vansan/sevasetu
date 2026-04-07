# 🚀 Migration Guide: Mac → Windows
### Project: `SevaSetu` (Next.js + Express + MongoDB)

> This document explains how to set up and run the `SevaSetu` project on a Windows machine after transferring it from macOS.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites-on-windows)
2. [Transfer the Project](#2-transfer-the-project)
3. [Set Up Environment Variables](#3-set-up-environment-variables)
4. [Start the Database](#4-start-the-database)
5. [Migrate MongoDB Data (Mac → Windows)](#5-migrate-mongodb-data-mac--windows)
6. [Install & Run](#6-install--run)
7. [Windows-Specific Gotchas](#7-windows-specific-gotchas)
8. [Quick Checklist](#8-quick-checklist)
9. [Useful Commands Reference](#9-useful-commands-reference)

---

## 1. Prerequisites on Windows

Install the following tools on the **target Windows machine** before proceeding:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | https://nodejs.org |
| **Git** | Latest | https://git-scm.com |
| **MongoDB Community** | v6+ | https://www.mongodb.com/try/download/community |
| **VS Code** *(recommended)* | Latest | https://code.visualstudio.com |
| **MongoDB Compass** *(optional)* | Latest | https://www.mongodb.com/try/download/compass |

> ⚠️ **Important:** During Node.js installation on Windows, make sure to check **"Add to PATH"** so `node` and `npm` commands work in any terminal.

> 💡 **Tip:** Alternatively, you can run MongoDB via Docker — see [Step 4](#4-start-the-database) for both options.

---

## 2. Transfer the Project

### Option A: Via Git *(Recommended)*

```bash
# On Mac — commit and push to GitHub
git add .
git commit -m "before migration"
git push origin main

# On Windows — clone the repository
git clone https://github.com/YOUR_USERNAME/sevasetu.git
cd sevasetu
```

### Option B: Via USB / ZIP

Copy the entire `sevasetu/` folder to the Windows machine, but **exclude** the following to keep the transfer size small:

| Exclude | Reason |
|---------|--------|
| `backend/node_modules/` | Will be reinstalled via `npm install` |
| `backend/dist/` | Will be rebuilt via `npm run build` |
| `frontend/node_modules/` | Will be reinstalled via `npm install` |
| `frontend/.next/` | Will be rebuilt automatically |
| `backend/.env` | Contains secrets — copy **manually** |
| `frontend/.env.local` | Contains secrets — copy **manually** |

> 💡 To create a clean ZIP on Mac, right-click the `sevasetu` folder → **Compress**, then delete the excluded folders from inside the ZIP before transferring.

---

## 3. Set Up Environment Variables

Both `.env` files are **gitignored** and will NOT transfer automatically via Git. You must create them manually on the Windows machine.

### 📁 Backend — `backend/.env`

Create a file at `backend/.env` with the following content:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sevasetu
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (for donation payments)
RAZORPAY_KEY_ID=your_razorpay_key_id

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 📁 Frontend — `frontend/.env.local`

Create a file at `frontend/.env.local` with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> 🔐 **Never commit `.env` or `.env.local` to Git.** They contain sensitive credentials.

---

## 4. Start the Database

SevaSetu uses **MongoDB** as its database. You have two options:

### Option A: MongoDB Installed Locally *(Recommended for beginners)*

After installing MongoDB Community on Windows:

```bash
# MongoDB should auto-start as a Windows Service after installation.
# To manually start it, open PowerShell as Administrator and run:
net start MongoDB
```

Verify it's running by opening **MongoDB Compass** and connecting to:
```
mongodb://localhost:27017
```

### Option B: MongoDB via Docker *(Recommended for consistency)*

If you have **Docker Desktop** installed:

```bash
# Make sure Docker Desktop is open and running first!
docker run -d --name sevasetu-mongo -p 27017:27017 mongo:6
```

> This pulls the official MongoDB 6 image and starts it on port `27017` — the same port your backend expects.

---

## 5. Migrate MongoDB Data (Mac → Windows)

> ⚠️ **This step is only needed if you have existing data** (organizations, users, donations) in your local MongoDB on the Mac that you want to carry over to the Windows machine.
>
> If you are starting fresh on Windows, you can **skip this step**.

MongoDB provides two CLI tools for this — `mongodump` (export) and `mongorestore` (import). Both are included in the **MongoDB Database Tools** package.

### 📥 Step 1: Install MongoDB Database Tools

**On Mac** (if not already installed):
```bash
brew install mongodb/brew/mongodb-database-tools
```

**On Windows**: Download from https://www.mongodb.com/try/download/database-tools and install. After install, add the `bin` folder to your Windows PATH.

---

### 📤 Step 2: Export Data from Mac

Open Terminal on your **Mac** and run:

```bash
# Navigate to a safe folder to store the dump
cd ~/Desktop

# Export the entire sevasetu database
mongodump --uri="mongodb://localhost:27017/sevasetu" --out=./sevasetu-dump
```

This creates a folder `sevasetu-dump/sevasetu/` on your Desktop containing:

| File | Description |
|------|-------------|
| `users.bson` | All user accounts |
| `users.metadata.json` | Collection metadata & indexes |
| `organizations.bson` | All organization profiles |
| `organizations.metadata.json` | Metadata & indexes |
| `donations.bson` | All donation records |
| `donations.metadata.json` | Metadata & indexes |

> 💡 `.bson` is MongoDB's binary format — it's compact and preserves all data types exactly (ObjectId, Date, etc.).

---

### 🚚 Step 3: Transfer the Dump to Windows

Choose one of these methods:

**Option A — USB Drive:**
```
Copy the entire sevasetu-dump/ folder to a USB drive.
Plug it into the Windows machine and copy to Desktop (or any folder).
```

**Option B — Git (temporary commit):**
```bash
# On Mac — add dump to git temporarily (DO NOT push secrets)
cd sevasetu-dump
git init
git add .
git commit -m "db dump for migration"
git remote add origin https://github.com/YOUR_USERNAME/sevasetu-dump.git
git push origin main

# On Windows — clone it
git clone https://github.com/YOUR_USERNAME/sevasetu-dump.git
```

**Option C — Google Drive / OneDrive:**
```
Upload sevasetu-dump/ to your cloud storage.
Download on the Windows machine.
```

> 🔐 **Security Note:** The dump contains real user data. Delete the temporary Git repo or cloud file after the migration is complete.

---

### 📥 Step 4: Import Data on Windows

Make sure MongoDB is **running on Windows** (see Step 4), then open PowerShell or Command Prompt and run:

```bash
# Navigate to where you copied the dump folder
cd C:\Users\YourName\Desktop

# Restore the data into the sevasetu database
mongorestore --uri="mongodb://localhost:27017" --db=sevasetu ./sevasetu-dump/sevasetu
```

Successful output looks like:
```
2026-04-07T12:00:00.000+0530  restoring to sevasetu from dump
2026-04-07T12:00:00.100+0530  finished restoring sevasetu.users (12 documents, 0 failures)
2026-04-07T12:00:00.200+0530  finished restoring sevasetu.organizations (5 documents, 0 failures)
2026-04-07T12:00:00.300+0530  finished restoring sevasetu.donations (28 documents, 0 failures)
2026-04-07T12:00:00.400+0530  done
```

---

### ✅ Step 5: Verify the Data

Open **MongoDB Compass** on Windows, connect to `mongodb://localhost:27017`, and check:

- Database `sevasetu` exists
- Collections `users`, `organizations`, `donations` are present
- Document counts match what you had on Mac

Or verify via terminal:
```bash
# Open MongoDB shell
mongosh

# Switch to sevasetu database
use sevasetu

# Count documents in each collection
db.users.countDocuments()
db.organizations.countDocuments()
db.donations.countDocuments()
```

---

### ⚠️ What About Images?

SevaSetu uses **Cloudinary** for all image uploads (org logos, gallery images). This means:

- Images are **NOT stored in MongoDB** — only Cloudinary URLs are stored
- Images live in your **Cloudinary account in the cloud**
- They will work automatically on Windows as long as your Cloudinary credentials in `backend/.env` are correct
- **No image migration needed** ✅

---

## 6. Install & Run

Open a terminal (**Command Prompt**, **PowerShell**, or **Git Bash**) in the project folder and follow these steps:

### ▶️ Backend

```bash
# Navigate to the backend folder
cd backend

# Step 1: Install all dependencies
npm install

# Step 2: Build TypeScript to JavaScript
npm run build

# Step 3: Start the backend server (development mode with hot-reload)
npm run dev
```

Backend will be available at: **http://localhost:5000**

Verify it's working by opening: **http://localhost:5000/api/health** — you should see:
```json
{ "status": "ok", "message": "SevaSetu API is running 🙏" }
```

### ▶️ Frontend

Open a **new terminal**, then:

```bash
# Navigate to the frontend folder
cd frontend

# Step 1: Install all dependencies
npm install

# Step 2: Start the Next.js development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

> ⚠️ **Run backend FIRST**, then the frontend — the frontend makes API calls to `localhost:5000`.

---

## 7. Windows-Specific Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| **Line endings (CRLF vs LF)** | Git auto-converts line endings on Windows | Run `git config --global core.autocrlf true` |
| **Path separators** | Windows uses `\` instead of `/` | Node.js/Express handles this automatically ✅ |
| **Port conflicts** | Another app using port 3000 or 5000 | Check with `netstat -ano \| findstr :5000` |
| **`ts-node-dev` not found** | Missing global ts-node-dev | Run `npm install` inside `backend/` — it's a local devDependency |
| **MongoDB connection refused** | MongoDB service not started | Run `net start MongoDB` as Administrator |
| **`EACCES` permission error** | npm global permission issue | Use Node.js installed via official installer, not Homebrew equivalent |
| **`FRONTEND_URL` CORS error** | `.env` not created or wrong URL | Ensure `FRONTEND_URL=http://localhost:3000` in `backend/.env` |
| **Cloudinary upload failing** | Missing or wrong Cloudinary credentials | Copy correct keys from https://cloudinary.com/console |

---

## 8. Quick Checklist

Use this checklist to confirm everything is set up correctly:

**Setup**
- [ ] Node.js (v18+) installed on Windows
- [ ] Git installed on Windows
- [ ] MongoDB Database Tools installed on both Mac & Windows
- [ ] MongoDB running on Windows (locally or via Docker)
- [ ] Project copied/cloned to Windows machine
- [ ] `backend/.env` file created manually with all required keys
- [ ] `frontend/.env.local` file created manually

**Data Migration** *(skip if starting fresh)*
- [ ] `mongodump` run on Mac — `sevasetu-dump/` folder created
- [ ] Dump folder transferred to Windows machine
- [ ] `mongorestore` run on Windows — data imported
- [ ] Document counts verified in MongoDB Compass or `mongosh`
- [ ] Cloudinary credentials copied to `backend/.env` (images work without migration) ✅

**Running the App**
- [ ] `npm install` completed inside `backend/`
- [ ] `npm install` completed inside `frontend/`
- [ ] `npm run dev` running inside `backend/` (port 5000 active)
- [ ] Backend health check passes: **http://localhost:5000/api/health** ✅
- [ ] `npm run dev` running inside `frontend/` (port 3000 active)
- [ ] App accessible at **http://localhost:3000** ✅

---

## 9. Useful Commands Reference

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Build backend TypeScript manually
cd backend && npm run build

# Run backend in production mode (after build)
cd backend && npm start

# Build frontend for production
cd frontend && npm run build
cd frontend && npm start

# Check if a port is in use (Windows PowerShell)
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill a process using a port (replace PID with actual process ID from above)
taskkill /PID <PID> /F

# Check if MongoDB is running (Windows)
sc query MongoDB

# Start MongoDB service (run as Administrator)
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Check running Docker containers (if using Docker for MongoDB)
docker ps
```

---

## 📁 Project Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| **Backend** | Node.js + Express, TypeScript |
| **Database** | MongoDB (via Mongoose) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **File Uploads** | Cloudinary (multer + multer-storage-cloudinary) |
| **Payments** | Razorpay (direct to organization) |
| **Validation** | Zod |
| **Security** | Helmet, CORS, express-rate-limit |

---

## 📂 Project Folder Structure

```
sevasetu/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, error handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helpers
│   │   └── index.ts       # App entry point
│   ├── dist/              # Compiled output (auto-generated)
│   ├── .env               # ⚠️ Create manually — NOT in Git
│   ├── .env.example       # Template for .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   └── app/           # Next.js App Router pages
│   ├── public/            # Static assets
│   ├── .env.local         # ⚠️ Create manually — NOT in Git
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── MIGRATION_MAC_TO_WINDOWS.md  # This file
```

---

*Last updated: April 2026*
