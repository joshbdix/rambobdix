# JOSH RAMBO BDIX Bypass™

**Official Brand Name:** JOSH RAMBO BDIX Bypass™  
**Short Brand Name:** JOSH RAMBO  
**Main Tagline:** Faster Bangladesh Together  
**Brand Category:** BDIX Bypass / Networking Service  
**Primary Business Statement:** *"দীর্ঘ ৩ বছরের বেশি সময় সফলতার সাথে BDIX বাইপাস প্রোভাইড করে যাচ্ছি।"*  
**Supporting Statement:** *"Bufferless experience এর জন্য JOSH RAMBO BDIX Bypass™-এর সাথে যোগাযোগ করুন।"*

---

## ⚡ Overview

A production-ready website and separate Admin Dashboard for **JOSH RAMBO BDIX Bypass™**, built with React 18, TypeScript, Tailwind CSS, Lucide Icons, and Supabase Auth with PostgreSQL Row Level Security (RLS).

### Key Features
- **Public Website (`/`):**
  - High-performance Dark Networking Theme with electric blue & cyan accents.
  - Interactive Bangladesh Network Vector Map showing routing nodes (Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh).
  - Dynamic Packages display with pricing, features, and direct Telegram checkout button.
  - Dynamic Services, FAQs, and real-time Announcements Bar.
  - Multi-channel Floating Contact Button (Telegram Personal, Telegram Group, Facebook Messenger).
  - Dedicated pages: `/`, `/about`, `/services`, `/packages`, `/faq`, `/contact`.
- **Administrative Console (`/admin`):**
  - Supabase Auth integration with PostgreSQL Row Level Security (RLS).
  - Full CRUD management for Packages, Services, FAQs, Announcements, Website Settings, and Contact Channels.
  - Immutable Audit Logs recording all administrative mutations.
  - Multi-tier Admin Role Management (Super Admin, Admin, Editor) with suspension and authorization controls.
  - Built-in Sandbox Demo Mode allowing immediate interactive preview testing.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Supabase Setup & Database Schema

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase-schema.sql` from this repository and run it in the SQL Editor.
4. Copy your project credentials:
   - `Project URL`
   - `anon public key`
5. Create `.env` in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
6. In Supabase Auth, invite or create your admin user, then execute the following SQL to grant Super Admin privileges:
```sql
INSERT INTO public.admins (id, email, full_name, role, status)
VALUES ('<USER_UUID_FROM_AUTH>', 'admin@joshrambo.bd', 'Josh Rambo Admin', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin', status = 'active';
```

---

## 🌐 GitHub Pages Deployment Guide

This project is optimized for static hosting on **GitHub Pages**:
- Uses `HashRouter` to prevent 404 errors on deep routes (`/#/admin`, `/#/packages`, etc.).
- Includes base path support in `vite.config.ts`.

### Steps:
1. Push this repository to GitHub.
2. Go to **Repository Settings** > **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** or deploy from `gh-pages` branch.
4. If using GitHub Actions, create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🔒 Security Principles
- **No Client-Side Authorization Bypass:** Authorization is enforced by PostgreSQL RLS functions (`is_active_admin()` and `is_super_admin()`).
- **Anon Key Only:** Only the public anon key is exposed in the frontend. The `service-role` key is never bundled.
- **Strict Brand Integrity:** The website strictly represents **JOSH RAMBO BDIX Bypass™** (or **JOSH RAMBO**).

---

## 📞 Official Contacts
- **Telegram Personal:** [https://t.me/joshvhai](https://t.me/joshvhai) (`@joshvhai`)
- **Telegram Community Group:** [https://t.me/josharmy007](https://t.me/josharmy007)
- **Facebook Messenger:** [https://www.fb.com/joshrambo007](https://www.fb.com/joshrambo007)
