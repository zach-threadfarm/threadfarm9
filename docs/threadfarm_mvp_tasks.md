# Threadfarm MVP Task List

## 🎯 Project Overview
Build Threadfarm – an AI-powered tool that converts audio, video, or text files (including YouTube URLs) into engaging X (Twitter) threads. This MVP uses Next.js with TypeScript and Supabase for the backend, keeping it lean and simple.

---

## 🟩 Phase 1: Build Basic UI with Dummy Data

# Threadfarm MVP Task List

## 🎯 Project Overview
Build Threadfarm – an AI-powered tool that converts audio, video, or text files (including YouTube URLs) into engaging X (Twitter) threads. This MVP uses Next.js with TypeScript and Supabase for the backend, keeping it lean and simple.

---

## 🟩 Phase 1: Build Basic UI with Dummy Data

### 1.1 Project Setup & Configuration
- [x] Create Next.js project with TypeScript: `npx create-next-app@latest threadfarm --typescript --tailwind --eslint --app`
- [x] **Do not enable Turbopack** – use the default build system.  
- [x] **Do not customize the import alias** – keep it as `@/*` by default.  
- [x] Install Supabase client: `npm install @supabase/supabase-js`
- [x] Install additional dependencies: `npm install lucide-react clsx`
- [x] Create `.env.local` with placeholder Supabase credentials
- [x] Configure `next.config.js` for image optimization
- [x] Set up Tailwind config with custom colors and fonts
- [ x] **Ensure `npm run dev` works** – set up and confirm local dev environment.

### 1.2 Landing Page Creation
- [x] Create `/app/page.tsx` with hero section, subheadline, CTA button
- [x] Add 4-step progress stepper (Upload → Transcribe → Generate → Publish)
- [x] Style with Tailwind for clean, modern look
- [x] Responsive design for mobile and desktop
- [x] "Get Started" button linking to `/login`


### 1.3 Authentication Pages
- [x] Create `/app/login/page.tsx` and `/app/signup/page.tsx` with email/password forms
- [x] Add validation, loading states, error messages
- [x] Consistent style with landing page


### 1.5 Create Thread Flow – Step 1 (Upload)
- [x] `/app/create/page.tsx` to host 4-step flow
- [x] Step 1: Drag & drop zone with file picker
- [x] YouTube URL input validation
- [x] Show file preview after selection
- [x] "Next" button only enabled with valid input

### 1.6 Create Thread Flow – Step 2 (Transcribe & Edit)
- [x] Display dummy transcript in editable text area
- [x] Character count indicator
- [x] "Regenerate Transcript" button (dummy)
- [x] "Previous" and "Next" navigation

### 1.7 Create Thread Flow – Step 3 (Generate Thread)
- [x] Settings panel: max posts (slider), characters per post
- [x] Display generated dummy posts in editable cards
- [x] Drag & drop reorder for posts
- [x] Individual post edit inline
- [x] "Add Image" placeholders

### 1.8 Create Thread Flow – Step 4 (Edit & Publish)
- [x] Final preview of thread (all posts, title editable)
- [x] Edit thread title
- [x] Add/reorder images in posts
- [x] "Save as Draft" and "Publish" buttons (dummy actions)
- [x] Success message/confirmation screen after publish

### 1.9 Settings Page
- [x] Create `/app/settings/page.tsx` with user profile (name, email, avatar placeholder)
- [x] Dummy social media connections (X, Instagram)
- [x] Subscription/billing placeholder
- [x] Account deletion option

---

## 🟧 Phase 2: Backend (Supabase)

### 2.1 Supabase Setup
- [x] Create Supabase project and enable email auth
- [x] Configure RLS and storage buckets for file uploads
- [x] Set up `.env.local` with Supabase credentials

### 2.2 Database Schema
- [x] `users` table
- [x] `threads` table
- [x] `posts` table with `image_url` support
- [x] Indexes and FK constraints
- [x] Test data via Supabase dashboard

### 2.3 Storage Setup
- [x] Create storage bucket: `thread-files` (audio, video, text folders)
- [x] Policy for authenticated users
- [x] Test upload via Supabase UI

### 2.4 API Routes
- [x] `/api/auth/route.ts` for auth handling
- [x] `/api/threads/route.ts` for CRUD
- [ ] `/api/upload/route.ts` for file uploads
- [x] Add error handling, TypeScript types

### 2.5 DB Helpers
- [x] `lib/supabase.ts` with Supabase client
- [x] Helper functions for CRUD threads/posts
- [x] Error handling and data validation

---

## 🟦 Phase 3: Connect Frontend with Backend

### 3.1 Auth Integration
- [ ] Replace dummy auth with Supabase real auth
- [ ] Auth state and protected routes
- [ ] Email verification

### 3.2 Dashboard Data
- [ ] Replace dummy threads with real data from Supabase
- [ ] Add loading/error states
- [ ] Real-time updates for thread status
- [ ] Pagination and search/filter for threads

### 3.3 Upload Integration
- [ ] Connect file uploads to Supabase Storage
- [ ] Progress tracking, file size limits, errors
- [ ] Save file URLs to DB

### 3.4 Create Flow Integration
- [ ] Save thread data after each step
- [ ] Auto-save drafts
- [ ] Connect transcript edit to DB
- [ ] Save post reordering and images
- [ ] Share simulation for publish

---

## 🟪 Phase 4: Final Polish & Market-Ready

### 4.1 Design System
- [ ] Color palette, typography, spacing
- [ ] Reusable components (buttons, inputs, cards)
- [ ] Loading, error, empty states
- [ ] Dark mode support

### 4.2 UX Optimization
- [ ] Keyboard shortcuts
- [ ] Undo/redo editing
- [ ] Tooltips and hints
- [ ] Onboarding flow for new users

### 4.3 Competitive Features
- [ ] Thread templates
- [ ] Analytics and scheduling (dummy)
- [ ] Collaboration features (dummy)
- [ ] Export functionality

### 4.4 Performance & SEO
- [ ] Image optimization, code splitting
- [ ] Service worker for offline
- [ ] SEO optimization

### 4.5 Security & Compliance
- [ ] Input sanitization, rate limiting
- [ ] Secure headers, HTTPS
- [ ] Privacy policy and data handling

### 4.6 Testing & QA
- [ ] Automated tests for flows
- [ ] Cross-browser, device tests
- [ ] Accessibility compliance
- [ ] Final deployment on Vercel

---

## ✅ Verification & Testing for Each Step
- Each task has: **file(s) to edit**, **UI element to build**, and **how to verify**.
- Dummy data first (Phase 1), real data later (Phase 3).
- Test on mobile/desktop, confirm images match final UI.

Let's do this! 🚀

NEXT_PUBLIC_SUPABASE_URL=https://kpzfndeuhvdxrcglpqco.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
