# TechAwaken Intelligence Platform

> Official website, dynamic careers engine, and admin portal for **TechAwaken Intelligence Pvt. Ltd.**
> Live Domain: [https://techawakenintelligence.com](https://techawakenintelligence.com)

---

## 🏗️ Architecture Overview

| Component | Platform / Tech | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 (React 19) + Vercel** | High-performance aesthetic marketing website, interactive showcase, and `/admin` portal |
| **Backend API** | **Node.js (Express + TypeScript) + Render** | REST API engine for dynamic content, open positions, candidate applications, and admin auth |
| **Database** | **PostgreSQL (Aiven Cloud)** | Managed PostgreSQL cluster with SSL for positions, applicants, and administrative credentials |
| **Domain & DNS**| **Hostinger** | Primary domain `techawakenintelligence.com` pointing to Vercel (frontend) & Render (API) |
| **AI Protocol** | **Model Context Protocol (MCP)** | Project-scoped MCP integrations for Vercel, Render, Aiven, and Hostinger |

---

## ⚡ Project-Scoped MCP Configuration

The project is preconfigured with MCP (Model Context Protocol) endpoints in `.agents/plugins/techawaken-integrations/mcp_config.json`, `.agents/mcp_config.json`, and `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "vercel": {
      "serverUrl": "https://mcp.vercel.com"
    },
    "render": {
      "serverUrl": "https://mcp.render.com/mcp"
    },
    "aiven": {
      "serverUrl": "https://mcp.aiven.live/mcp"
    },
    "hostinger": {
      "serverUrl": "https://mcp.hostinger.com"
    }
  }
}
```

---

## 🚀 Quick Start (Local Development)

### 1. Run the Node.js Backend

```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Run the Next.js Frontend

```bash
# In the project root
pnpm install
pnpm dev
# Frontend runs on http://localhost:3000
```

- Visit `http://localhost:3000` for the main website.
- Visit `http://localhost:3000/admin` for the Admin Portal.
  - **Default Username:** `admin`
  - **Default Password:** `TechAwaken@2026`

---

## 🌐 Cloud Deployment Guide

### 1. Aiven (PostgreSQL Database)
1. In your **Aiven Console** ([console.aiven.io](https://console.aiven.io)), create a **PostgreSQL** service (Free / Startup plan).
2. Copy the **Service URI** (looks like: `postgresql://avnadmin:PASSWORD@pg-service.aivencloud.com:PORT/defaultdb?sslmode=require`).
3. Set this URI as the `DATABASE_URL` environment variable in Render.

### 2. Render (Node.js Backend API)
1. Go to **Render Dashboard** ([dashboard.render.com](https://dashboard.render.com)).
2. Click **New +** → **Blueprint** and connect the repository:
   - `https://github.com/techawaken-intelligence-devs/techawaken-website`
   - Render automatically reads `render.yaml`.
3. Provide the environment variables:
   - `DATABASE_URL`: Your Aiven PostgreSQL connection URI.
   - `ADMIN_DEFAULT_PASSWORD`: Your secret admin panel password.
4. Once deployed, note your service URL (e.g., `https://techawaken-backend.onrender.com`).

### 3. Vercel (Next.js Frontend)
1. Go to **Vercel Dashboard** ([vercel.com](https://vercel.com)).
2. Import git repository: `https://github.com/techawaken-intelligence-devs/techawaken-website`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://techawaken-backend.onrender.com`).
4. Click **Deploy**.

### 4. Hostinger (Domain DNS Setup)
In your Hostinger DNS Zone manager for `techawakenintelligence.com`:
- **For Vercel (Frontend Apex & Subdomain):**
  - `A` Record: `@` pointing to `76.76.21.21`
  - `CNAME` Record: `www` pointing to `cname.vercel-dns.com`
- **For Render (Optional Backend Subdomain e.g. `api.techawakenintelligence.com`):**
  - `CNAME` Record: `api` pointing to your Render app URL (`techawaken-backend.onrender.com`).

---

## 🔒 Admin Panel Features (`/admin`)

- **Open Positions Management**: Full CRUD interface to publish, edit, draft, and remove career opportunities.
- **Candidate Submissions Pipeline**: Real-time review of applicant profiles, portfolio links, resumes, and status updates (New → Reviewed → Interviewing → Accepted/Rejected).
- **Direct Database Sync**: Automatically synchronizes with Aiven PostgreSQL.
