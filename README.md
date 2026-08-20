# ⚡ FlashBites — Full-Stack Swiggy/Zomato Hackathon Application

FlashBites is a full-stack hyperfast campus food delivery web application engineered for hackathons and contest evaluation. It features a complete end-to-end order lifecycle state machine across **Customer 👤**, **Restaurant Kitchen 🍳**, and **Delivery Partner 🛵** roles.

---

## 🔑 Demo Access Credentials

Use these credentials on the **Animated Sign In screen** to test each role dashboard:

| Role | Demo Email | Password | Access Capabilities |
|---|---|---|---|
| **Customer** | `customer@flashbites.com` | `password123` | Browse 5 restaurants, veg/non-veg filter, cart checkout, 7-stage order status stepper, Leaflet live map tracking. |
| **Restaurant** | `restaurant@flashbites.com` | `password123` | Kitchen order queue, confirm orders, start food prep, mark ready for pickup, auto-assign drivers. |
| **Delivery Partner** | `driver@flashbites.com` | `password123` | View ready deliveries, confirm pickup, update en-route location, mark order delivered. |

---

## 🏛️ Contest Documentation (HLD / LLD)
- 📄 **High-Level Design (HLD)**: [`docs/HLD.md`](file:///c:/Users/exam/Downloads/System%20Design/docs/HLD.md)
- 📄 **Low-Level Design (LLD)**: [`docs/LLD.md`](file:///c:/Users/exam/Downloads/System%20Design/docs/LLD.md)
- 📄 **PostgreSQL Schema DDL**: [`supabase/schema.sql`](file:///c:/Users/exam/Downloads/System%20Design/supabase/schema.sql)
- 📄 **Database Seed Script**: [`supabase/seed.sql`](file:///c:/Users/exam/Downloads/System%20Design/supabase/seed.sql)

---

## 🚀 Quick Run Guide

### Option 1: Zero-Install Instant Demo
Open **[`standalone_demo.html`](file:///c:/Users/exam/Downloads/System%20Design/standalone_demo.html)** directly in any browser — zero npm installation required!

### Option 2: Full React Dev Server
```bash
# 1. Navigate to project directory
cd "C:\Users\exam\Downloads\System Design"

# 2. Install node packages
npm install

# 3. Launch Vite development server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## ⚡ Deployment Instructions

### 1. Database & Supabase Backend Setup
1. Create a free PostgreSQL project on [Supabase.com](https://supabase.com).
2. Execute [`supabase/schema.sql`](file:///c:/Users/exam/Downloads/System%20Design/supabase/schema.sql) in the Supabase SQL Editor.
3. Run [`supabase/seed.sql`](file:///c:/Users/exam/Downloads/System%20Design/supabase/seed.sql) to preload 5 restaurants & menu items.

### 2. Frontend Deployment (Vercel)
1. Push this repository to GitHub.
2. Import repo into [Vercel.com](https://vercel.com).
3. Set Framework Preset to **Vite**, build command to `npm run build`, and deploy!
