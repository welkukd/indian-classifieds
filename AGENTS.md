<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DesiList (Indian Classifieds) - Status Update

## Project Status: **DEPLOYED & WORKING** (Mock Data Mode)

**Live URL**: https://indian-classifieds.vercel.app
**Vercel Project**: `indian-classifieds` (team_1MT3qwKcThJzTWuaPDMn6mKB)
**GitHub**: https://github.com/welkukd/indian-classifieds (synced)

## Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Auth + RLS) - **Not yet configured**
- **Cron**: Vercel daily cron at 2 AM (`/api/cron/cleanup-expired`)
- **Hosting**: Vercel Hobby (free tier, region: bom1 Mumbai)

## Architecture Complete

### Core Features (All Implemented)
1. **Categories API** - 8 categories with mock fallback
2. **Cities API** - Major Indian cities with mock fallback
3. **Listings API** - Full CRUD with mock data (6 sample listings)
4. **Health Check** - `/api/health` returns database status
5. **Cron Cleanup** - Daily cleanup of expired listings (protected by CRON_SECRET)
6. **Mock Data Fallback** - All APIs work without Supabase configured

### API Endpoints (Verified Working)
- `GET /api/categories` → 8 categories with mock data
- `GET /api/cities` → Major Indian cities with mock data  
- `GET /api/listings` → 6 sample listings with images
- `GET /api/health` → `{status: "healthy", database: "not_configured"}`
- `GET /api/cron/cleanup-expired` → Requires `Authorization: Bearer CRON_SECRET`, returns cleanup status

### Vercel Configuration
- Region: `bom1` (Mumbai)
- Cron: Daily at 2 AM (`0 2 * * *`)
- Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS
- Functions maxDuration: 30s

### Free Tier Usage
- **Vercel**: 100GB bandwidth, 1000 invocations/day — minimal usage
- **Supabase**: 500MB DB, 2GB bandwidth — **NOT YET PROVISIONED**

## External Requirements (User Must Provide)
| Variable | Source | Status |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Required |
| `DATABASE_URL` | Supabase (pooler port 6543) | Required |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Already in Vercel |
| `CRON_SECRET` | `openssl rand -base64 32` | Already in Vercel |

## Next Steps (If Continuing)
1. Create Supabase Mumbai project
2. Run `supabase/schema.sql` in Supabase SQL Editor (includes migrations for categories, subcategories, cities, listings, profiles, saved_listings, listing_views + search_listings RPC)
3. Set Supabase env vars in Vercel Dashboard
4. Deploy again to activate database-backed APIs
5. Point custom domain (desilist.in) to Vercel (optional)

## Known Issues
- Vercel Data Cache persists across deploys - bump cache key in APIs after schema changes
- Cron returns 404 on preview deployments - only works on production URL

# UPDATED - 2026-10-21 08:55:00 EDT — Autonomous orchestrator scan
# DEPLOYED & WORKING — Mock Data Mode (Supabase Not Configured)
# Live at https://indian-classifieds.vercel.app — Health endpoint returns 200
# All API routes functional with mock data fallback
# Cron endpoint returns 401 (expected without CRON_SECRET)
# GitHub repo synced (origin/main up to date)
#
# VERIFIED 2026-10-27:
# - Health endpoint: https://indian-classifieds.vercel.app/api/health returns {"status":"healthy","database":"not_configured"}
# - Categories API: 8 categories with mock data (Electronics, Vehicles, Property, Jobs, Services, Fashion, Home & Garden, Books & Hobbies)
# - Listings API: 6 sample listings with images, mock data working
# - Cities API: Major Indian cities with mock data
# - Cron endpoint: /api/cron/cleanup-expired returns 401 (correct — requires CRON_SECRET)
# - Build: local typecheck/lint/build all PASS
# - EXTERNAL BLOCKER UNCHANGED: Supabase project not yet provisioned