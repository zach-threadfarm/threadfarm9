# Threadfarm Simple Architecture (Cursor-Friendly)

## 1. Minimal Project Structure

```
threadfarm/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard (shows all threads)
│   │   ├── create/
│   │   │   └── page.tsx             # Single page for all 4 steps
│   │   ├── settings/
│   │   │   └── page.tsx             # User settings
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts         # Auth handling
│   │   │   ├── threads/
│   │   │   │   └── route.ts         # All thread operations
│   │   │   └── upload/
│   │   │       └── route.ts         # File upload
│   │   ├── layout.tsx               # Root layout with sidebar nav
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx               # Sidebar nav
│   │   ├── ThreadCard.tsx           # Thread display
│   │   ├── StepForm.tsx             # Handles all 4 steps in one component
│   │   ├── FileUpload.tsx           # Drag & drop and file picker
│   │   └── PostCard.tsx             # Individual post display (edit, reorder, image)
│   ├── lib/
│   │   ├── supabase.ts              # Single Supabase client
│   │   └── utils.ts                 # Helper functions
│   └── types/
│       └── index.ts                 # All types in one file
├── .env.local
├── next.config.js
├── package.json
└── tailwind.config.js
```

## 2. Data Flow

```
Landing Page → Login → Dashboard → Create (4 steps) → Back to Dashboard
```

- **4-step flow** in `/create`:
  1. **Upload** (audio/video/text + YouTube URLs)
  2. **Transcribe & Edit** (edit dummy transcript)
  3. **Generate Thread** (set # posts, reorder, add images)
  4. **Edit & Publish** (final edit, reorder, add images, publish/share)

## 3. Database Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### threads
```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, published
  transcript TEXT,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES threads(id),
  content TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. API Endpoints

### `/api/threads` - Thread CRUD
```typescript
// GET, POST, PUT, DELETE
```

### `/api/upload` - File uploads
```typescript
// POST: upload to Supabase Storage
```

## 5. Components

- **StepForm.tsx** – Single file for entire flow, driven by `currentStep` state.  
- **PostCard.tsx** – Reusable for both Step 3 & 4 with edit, reorder, image upload.  
- **FileUpload.tsx** – Drag & drop & file picker, YouTube URL input.

## 6. Dummy AI Services
- **Transcription** – dummy text in `edit transcript`.  
- **Thread Generation** – dummy array of post data.

## 7. Essential Config
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

## 8. Testing & Verification
- Explicitly test each step with dummy data first (Phase 1).  
- Confirm UI matches the **landing page** aesthetic and flows from images.

---
