Build a production-ready full-stack web platform named **"SevaSetu"**.

---

# 🧠 PRODUCT DEFINITION

SevaSetu is a **discovery and listing platform** for NGOs, temples, and charitable organizations.

It allows users to:
- Find organizations
- View their details (microsite)
- Donate directly to them

⚠️ IMPORTANT:
This is NOT a fundraising platform.
The platform does NOT hold or route funds.
All donations go directly to the organization.

---

# 🎯 BRANDING

App Name: SevaSetu  
Taglines:
- "Connecting Hearts to Causes"
- "Find. Trust. Support."

---

# 🧱 TECH STACK

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI (preferred)

Backend:
- Node.js with Express (or NestJS if structured better)
- TypeScript

Database:
- MongoDB with Mongoose

Auth:
- JWT-based authentication
- bcrypt password hashing

File Upload:
- Cloudinary (preferred)

Payments:
- Razorpay Checkout (direct payment to org account)

---

# 👤 USER ROLES

1. Public User
   - No login required for browsing
   - Can search, view, and donate

2. Organization
   - Register/login
   - Create and manage their microsite

3. Admin
   - Approve/reject organizations
   - Full CRUD access

---

# 🔐 AUTHENTICATION

- Email/password signup/login
- JWT token system
- Role-based authorization middleware
- Secure password hashing

---

# 🏢 ORGANIZATION MODULE

## Organization Registration Form
Fields:
- Name
- Type (NGO / Temple / Trust / Other)
- Description
- Address
- City
- State
- Pincode
- Contact Email
- Phone Number
- Gallery Images (multiple upload)
- Logo Image
- Razorpay Account ID / Payment Key

## Features
- Create profile
- Edit profile
- Upload images
- Submit for approval
- View status (pending/approved/rejected)

---

# 🛠 ADMIN PANEL

Features:
- Dashboard (basic stats)
- List all organizations
- Approve / Reject
- Edit / Delete
- Mark as "Verified" ⭐
- Filter/search organizations

---

# 🌐 PUBLIC USER FEATURES

## Homepage
- Hero section with branding
- Search bar (name, city, category)
- Category filters:
  - NGO
  - Temple
  - Education
  - Health
  - Food
- Featured organizations
- Verified organizations section

## Listing Page
- Grid/card layout
- Org name
- Short description
- Location
- Thumbnail
- Verified badge

## Organization Detail Page (Microsite)

Sections:
1. Hero (name + banner)
2. Overview
3. Gallery
4. Contact Info
5. Donate Button

---

# 💳 DONATION FLOW

- Use Razorpay Checkout
- Payment goes directly to organization account
- Platform does NOT store money
- Only optional metadata stored:
  - orgId
  - amount
  - paymentId (if available)

---

# 🗂 DATABASE DESIGN

## Users
- _id
- name
- email
- password
- role (admin / organization)
- createdAt

## Organizations
- _id
- name
- type
- description
- address
- city
- state
- pincode
- contactEmail
- phone
- logo
- images[]
- razorpayAccountId
- isApproved (boolean)
- isVerified (boolean)
- createdBy (userId)
- createdAt

## Donations (optional)
- _id
- orgId
- amount
- paymentId
- createdAt

---

# 🔍 SEARCH & FILTERING

- Search by:
  - name
  - city
  - type
- MongoDB text index
- Filter by category

---

# 🎨 UI/UX REQUIREMENTS

- Clean, modern design
- Mobile responsive
- Accessible UI
- Card-based listings
- Sticky donate button
- Loading states & error handling

---

# 🔐 SECURITY

- Input validation (Joi/Zod)
- Protected routes
- Prevent unauthorized edits
- Sanitize inputs
- Rate limiting (basic)

---

# 📦 PROJECT STRUCTURE

- Monorepo OR separate frontend/backend
- Backend:
  - routes
  - controllers
  - models
  - services
  - middleware
- Frontend:
  - components
  - pages/app router
  - hooks
  - utils

---

# 🚀 EXTRA (IMPORTANT FOR QUALITY)

- Environment variables setup
- API documentation (basic)
- Error handling system
- Reusable components
- Clean code (no placeholders)

---

# ⚠️ DO NOT INCLUDE

- Commission system
- Subscription model
- Mobile app
- Advanced analytics

---

# 🎯 FINAL GOAL

Generate a **complete working codebase** that:
- Can be run locally
- Can be deployed
- Is scalable for future features

---

# 📌 OUTPUT REQUIREMENTS

- Full code (frontend + backend)
- Setup instructions
- Environment config
- Sample data (optional)
- Clear folder structure

---

Ensure the implementation is **complete, not partial**, and follows best practices