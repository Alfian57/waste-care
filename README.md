# WasteCare - Smart Waste Management 🌱

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://web.dev/progressive-web-apps/)

WasteCare adalah aplikasi Progressive Web App (PWA) untuk manajemen sampah cerdas yang memungkinkan pengguna melaporkan masalah sampah, bergabung dalam campaign pembersihan lingkungan, dan berkontribusi dalam menjaga kebersihan komunitas

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Requirements](#-requirements)
- [Setup Project](#-setup-project)
- [Struktur Project](#-struktur-project)
- [Routing & Navigasi](#-routing--navigasi)
- [Fitur Detail](#-fitur-detail)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API & Services](#-api--services)
- [PWA Features](#-pwa-features)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Fitur Utama

### 1. **Autentikasi & Manajemen User**
- Login/Register dengan Email & Password
- OAuth Login dengan Google
- Protected Routes dengan session management
- Profile management dengan sistem EXP (Experience Points)

### 2. **Pelaporan Sampah (Report)**
- Ambil foto sampah menggunakan kamera device
- Validasi foto dengan AI untuk mendeteksi apakah gambar berisi sampah
- Geolocation untuk menentukan lokasi sampah
- Klasifikasi otomatis: jenis sampah, volume, dan kategori lokasi
- Kompresi dan optimisasi gambar otomatis
- Sistem EXP reward (+100 EXP per laporan)

### 3. **Campaign Management**
- Lihat daftar campaign pembersihan lingkungan
- Filter campaign berdasarkan status (upcoming, ongoing, finished)
- Join/Leave campaign dengan batas maksimal partisipan
- Buat campaign baru dari laporan sampah yang ada
- Integrasi dengan peta untuk menampilkan lokasi campaign
- Sistem EXP reward (+100 EXP untuk join campaign)

### 4. **Dashboard & Peta Interaktif**
- Peta interaktif menggunakan MapTiler SDK
- Marker untuk setiap laporan sampah di peta
- Filter dan pencarian laporan berdasarkan radius
- Bottom sheet dengan detail laporan
- Navigasi ke lokasi campaign dari peta

### 5. **Leaderboard**
- Ranking pengguna berdasarkan total EXP
- Top 3 users dengan badge khusus (👑🥈🥉)
- Real-time user ranking dan statistik
- Privacy-friendly dengan email censoring

### 6. **Statistik & Analytics**
- Statistik provinsi dengan jumlah laporan sampah
- Top 5 cities berdasarkan performa waste management
- Overall statistics: total campaign, partisipan, area bersih
- Visualisasi data di landing page

### 7. **PWA (Progressive Web App)**
- Installable di mobile & desktop
- Offline support dengan service worker
- Caching strategi untuk performa optimal
- Manifest untuk app-like experience
- Push notification ready

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 4.x
- **Font**: Circular Std (Custom Font)

### Backend & Database
- **BaaS**: Supabase (PostgreSQL + PostGIS)
- **Authentication**: Supabase Auth (Email/Password + OAuth Google)
- **Storage**: Supabase Storage (untuk gambar)
- **Edge Functions**: Supabase Functions (submit-report, get-nearby-reports)
- **Real-time**: Supabase Realtime subscriptions

### Maps & Geolocation
- **Map Provider**: MapTiler SDK 3.8.0
- **Geolocation**: Browser Geolocation API
- **Spatial Queries**: PostGIS (geography type)

### PWA
- **PWA Plugin**: next-pwa 5.6.0
- **Service Worker**: Workbox (automatic generation)
- **Caching**: NetworkFirst strategy

### Development Tools
- **Linter**: ESLint 9.x
- **Package Manager**: npm/yarn/bun
- **Build Tool**: Turbopack (Next.JS 15)

## 📦 Requirements

### System Requirements
- **Node.js**: >= 20.x
- **npm/yarn/bun**: Latest version
- **Browser**: Modern browser dengan support untuk:
  - Geolocation API
  - Camera API
  - Service Worker
  - IndexedDB

### Account Requirements
- **Supabase Account**: Untuk database dan authentication
- **MapTiler Account**: Untuk map tiles dan SDK
- **Google Cloud Console**: (Opsional) untuk OAuth Google

## 🚀 Setup Project

### 1. Clone Repository
```bash
git clone https://github.com/Alfian57/waste-care.git
cd waste-care/waste-care-front-end
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
# atau
bun install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` dengan credentials Anda:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MapTiler
NEXT_PUBLIC_MAPTILER_API_KEY=your-maptiler-api-key
```

### 4. Setup Supabase Database

#### 4.1 Buat Tables
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  exp INTEGER DEFAULT 0
);

-- Reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_urls TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  waste_type TEXT NOT NULL CHECK (waste_type IN ('organik', 'anorganik', 'berbahaya', 'campuran')),
  waste_volume TEXT NOT NULL CHECK (waste_volume IN ('kurang_dari_1kg', '1_5kg', '6_10kg', 'lebih_dari_10kg')),
  location_category TEXT NOT NULL CHECK (location_category IN ('sungai', 'pinggir_jalan', 'area_publik', 'tanah_kosong', 'lainnya')),
  notes TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL
);

-- Campaigns table
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'finished')) DEFAULT 'upcoming',
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  organizer_name TEXT NOT NULL,
  organizer_type TEXT NOT NULL CHECK (organizer_type IN ('personal', 'organization'))
);

-- Campaign Participants table
CREATE TABLE campaign_participants (
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (campaign_id, profile_id)
);

-- Create indexes
CREATE INDEX idx_reports_location ON reports USING GIST (location);
CREATE INDEX idx_reports_user_id ON reports (user_id);
CREATE INDEX idx_campaigns_report_id ON campaigns (report_id);
CREATE INDEX idx_campaigns_status ON campaigns (status);
CREATE INDEX idx_campaign_participants_profile_id ON campaign_participants (profile_id);
```

#### 4.2 Buat RPC Functions
```sql
-- Function untuk get reports dengan coordinates
CREATE OR REPLACE FUNCTION get_reports_with_coordinates()
RETURNS TABLE (
  id INTEGER,
  user_id UUID,
  image_urls TEXT[],
  created_at TIMESTAMPTZ,
  waste_type TEXT,
  waste_volume TEXT,
  location_category TEXT,
  notes TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.user_id,
    r.image_urls,
    r.created_at,
    r.waste_type,
    r.waste_volume,
    r.location_category,
    r.notes,
    ST_Y(r.location::geometry) AS latitude,
    ST_X(r.location::geometry) AS longitude
  FROM reports r;
END;
$$ LANGUAGE plpgsql;

-- Function untuk add EXP
CREATE OR REPLACE FUNCTION add_exp_to_profile(
  user_id UUID,
  exp_amount INTEGER
)
RETURNS TABLE (new_exp INTEGER) AS $$
BEGIN
  UPDATE profiles
  SET exp = exp + exp_amount
  WHERE id = user_id
  RETURNING exp INTO new_exp;
  
  RETURN QUERY SELECT new_exp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 4.3 Setup Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reports policies
CREATE POLICY "Anyone can view reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Anyone can view campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create campaigns" ON campaigns FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Campaign participants policies
CREATE POLICY "Anyone can view participants" ON campaign_participants FOR SELECT USING (true);
CREATE POLICY "Users can join campaigns" ON campaign_participants FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can leave campaigns" ON campaign_participants FOR DELETE USING (auth.uid() = profile_id);
```

### 5. Setup OAuth Google (Opsional)
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Tambahkan Authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID dan Client Secret
7. Di Supabase Dashboard > Authentication > Providers > Google
8. Paste Client ID dan Client Secret
9. Enable Google provider

### 6. Run Development Server
```bash
npm run dev
# atau
yarn dev
# atau
bun dev
```

Open [http://localhost:3000](http://localhost:3000) di browser.

### 7. Build untuk Production
```bash
npm run build
npm run start
```

## 📁 Struktur Project

```
waste-care-front-end/
├── public/                      # Static assets
│   ├── icons/                   # PWA icons
│   ├── images/                  # Images
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   └── offline.html            # Offline fallback page
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── akun/              # Account page
│   │   │   ├── edit-profile/
│   │   │   ├── riwayat-laporan/
│   │   │   └── bantuan/
│   │   ├── api/               # API routes
│   │   │   └── leaderboard/
│   │   ├── auth/
│   │   │   └── callback/      # OAuth callback
│   │   ├── buat-campaign/     # Create campaign
│   │   ├── campaign/          # Campaign list
│   │   ├── dashboard/         # Main dashboard with map
│   │   ├── landing/           # Landing page components
│   │   ├── lapor/             # Report waste flow
│   │   │   ├── foto/          # Photo capture
│   │   │   ├── konfirmasi-foto/
│   │   │   ├── konfirmasi-data/
│   │   │   └── mengunggah/
│   │   ├── leaderboard/       # User rankings
│   │   ├── revalidasi/        # Revalidation flow
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── providers/         # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── shared/            # Shared components
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── MapTilerMap.tsx
│   │   │   ├── PhotoCapture.tsx
│   │   │   └── PermissionGuard.tsx
│   │   └── ui/                # UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Toast.tsx
│   │       └── ...
│   ├── contexts/              # React contexts
│   │   ├── ReportContext.tsx
│   │   └── RevalidationContext.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCampaigns.ts
│   │   ├── usePermission.ts
│   │   └── useReports.ts
│   ├── lib/                   # Libraries & services
│   │   ├── auth.ts            # Auth functions
│   │   ├── supabase.ts        # Supabase client
│   │   ├── reportService.ts   # Report CRUD
│   │   ├── campaignService.ts # Campaign CRUD
│   │   ├── expService.ts      # EXP management
│   │   ├── leaderboardService.ts
│   │   ├── statisticsService.ts
│   │   └── nearbyReportsService.ts
│   ├── types/                 # TypeScript types
│   │   ├── database.types.ts  # Supabase generated types
│   │   └── campaign.types.ts
│   ├── utils/                 # Utility functions
│   │   └── errorMessages.ts
│   └── config/                # Configuration files
│       └── exp.config.ts      # EXP reward configuration
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🛣 Routing & Navigasi

### Public Routes (Tidak perlu login)
- `/` - Landing page
- `/login` - Login page
- `/register` - Register page
- `/auth/callback` - OAuth callback handler

### Protected Routes (Perlu login)
- `/dashboard` - Dashboard dengan peta interaktif
- `/lapor` - Flow pelaporan sampah
  - `/lapor/foto` - Ambil foto sampah
  - `/lapor/konfirmasi-foto` - Konfirmasi foto
  - `/lapor/konfirmasi-data` - Konfirmasi data laporan
  - `/lapor/mengunggah` - Upload dan submit
- `/campaign` - Daftar campaign
- `/buat-campaign` - Buat campaign baru
- `/leaderboard` - Ranking pengguna
- `/akun` - Profile dan settings
  - `/akun/edit-profile` - Edit profile
  - `/akun/riwayat-laporan` - Riwayat laporan
  - `/akun/bantuan` - Help & support

### Bottom Navigation
Navigasi utama di bagian bawah layar:
1. **Beranda** (`/dashboard`) - Dashboard dengan peta
2. **Campaign** (`/campaign`) - Daftar campaign
3. **Leaderboard** (`/leaderboard`) - Ranking user
4. **Lapor** (`/lapor`) - Laporkan sampah
5. **Akun** (`/akun`) - Profile & settings

## 🎯 Fitur Detail

### 1. Sistem Pelaporan Sampah

#### Flow Pelaporan
1. **Ambil Lokasi** (`/lapor`) - GPS location
2. **Ambil Foto** (`/lapor/foto`) - Camera capture
3. **Konfirmasi Foto** (`/lapor/konfirmasi-foto`) - Preview & validation
4. **Konfirmasi Data** (`/lapor/konfirmasi-data`) - Manual input (opsional)
5. **Upload** (`/lapor/mengunggah`) - Submit ke server

#### AI Validation
- Foto divalidasi dengan AI untuk memastikan berisi sampah
- Otomatis mengklasifikasi:
  - **Jenis Sampah**: Organik, Anorganik, Berbahaya, Campuran
  - **Volume**: < 1kg, 1-5kg, 6-10kg, > 10kg
  - **Kategori Lokasi**: Sungai, Pinggir Jalan, Area Publik, Tanah Kosong, Lainnya
- Confidence score untuk akurasi

#### Image Processing
- Auto-resize maks 1024x1024px
- Kompresi JPEG (quality 80%)
- Base64 encoding untuk upload
- Preview sebelum submit

### 2. Campaign Management

#### Membuat Campaign
1. Pilih report sampah dari dashboard
2. Isi detail campaign:
   - Judul campaign
   - Tanggal dan waktu
   - Maksimal partisipan
   - Deskripsi
   - Tipe penyelenggara (Pribadi/Organisasi)
3. Submit campaign

#### Join/Leave Campaign
- User bisa join campaign yang belum penuh
- Otomatis tambah +100 EXP saat join
- Bisa leave campaign kapan saja
- Real-time update jumlah partisipan

#### Status Campaign
- **Upcoming**: Belum dimulai
- **Ongoing**: Sedang berlangsung
- **Finished**: Sudah selesai

### 3. Sistem EXP (Experience Points)

#### Cara Mendapatkan EXP
```typescript
CREATE_REPORT: 100 EXP        // Membuat laporan sampah
JOIN_CAMPAIGN: 100 EXP        // Join campaign
COMPLETE_CAMPAIGN: 150 EXP    // Complete campaign (future)
CREATE_CAMPAIGN: 200 EXP      // Buat campaign (future)
```

#### Leaderboard
- Ranking berdasarkan total EXP
- Top 3 mendapat badge khusus:
  - 🏆 Rank 1: Gold badge
  - 🥈 Rank 2: Silver badge
  - 🥉 Rank 3: Bronze badge
- Email di-censor untuk privacy (contoh: j***e@example.com)
- Tie-breaking: user yang lebih dulu daftar mendapat rank lebih tinggi

### 4. Peta Interaktif

#### Fitur Peta
- **Base Map**: MapTiler street map
- **User Location**: Marker lokasi user real-time
- **Waste Markers**: Pin untuk setiap laporan sampah
- **Clustering**: Otomatis cluster marker yang dekat
- **Search & Filter**: Cari laporan berdasarkan radius
- **Bottom Sheet**: Detail laporan saat marker di-klik

#### Nearby Reports
- Query laporan dalam radius tertentu (default 5km)
- Sortir berdasarkan jarak
- Show distance dalam meter/km
- Filter by waste type, volume, location category

### 5. Authentication & Authorization

#### Login Methods
1. **Email & Password**
   - Register dengan nama lengkap
   - Email verification
   - Password hashing otomatis

2. **Google OAuth**
   - One-click login
   - Auto-create profile
   - No password needed

#### Session Management
- JWT token di localStorage
- Auto-refresh token
- Persist session across tabs
- Auto-redirect ke login jika session expired

#### Protected Routes
- Middleware check authentication
- Auto-redirect ke `/login` jika belum login
- Auto-redirect ke `/dashboard` jika sudah login dan akses auth pages

## 🔐 Environment Variables

### Required Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role key (server-side only)

# MapTiler Configuration
NEXT_PUBLIC_MAPTILER_API_KEY=    # MapTiler API key
```

### Cara Mendapatkan Credentials

#### Supabase
1. Buat account di [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy URL dan anon key

#### MapTiler
1. Buat account di [maptiler.com](https://maptiler.com)
2. Go to Account > Keys
3. Create new key atau copy default key

## 🗄 Database Schema

### Tables

#### profiles
```sql
id         UUID PRIMARY KEY (references auth.users)
created_at TIMESTAMPTZ DEFAULT NOW()
exp        INTEGER DEFAULT 0
```

#### reports
```sql
id                SERIAL PRIMARY KEY
user_id           UUID (references auth.users)
image_urls        TEXT[]
created_at        TIMESTAMPTZ DEFAULT NOW()
waste_type        TEXT (organik|anorganik|berbahaya|campuran)
waste_volume      TEXT (kurang_dari_1kg|1_5kg|6_10kg|lebih_dari_10kg)
location_category TEXT (sungai|pinggir_jalan|area_publik|tanah_kosong|lainnya)
notes             TEXT
location          GEOGRAPHY(POINT, 4326)  -- PostGIS
```

#### campaigns
```sql
id               SERIAL PRIMARY KEY
title            TEXT NOT NULL
description      TEXT NOT NULL
start_time       TIMESTAMPTZ NOT NULL
end_time         TIMESTAMPTZ NOT NULL
max_participants INTEGER DEFAULT 10
created_at       TIMESTAMPTZ DEFAULT NOW()
status           TEXT (upcoming|ongoing|finished)
report_id        INTEGER (references reports)
organizer_name   TEXT NOT NULL
organizer_type   TEXT (personal|organization)
```

#### campaign_participants
```sql
campaign_id INTEGER (references campaigns)
profile_id  UUID (references profiles)
joined_at   TIMESTAMPTZ DEFAULT NOW()
PRIMARY KEY (campaign_id, profile_id)
```

### RPC Functions

#### get_reports_with_coordinates()
Return semua reports dengan latitude dan longitude yang di-extract dari PostGIS geography.

#### add_exp_to_profile(user_id, exp_amount)
Menambahkan EXP ke user profile secara atomic.

#### get_province_statistics(limit_count)
Statistik per provinsi untuk landing page.

#### get_city_statistics(limit_count)
Top cities berdasarkan waste management performance.

#### get_overall_statistics()
Overall statistics: total campaign, partisipan, cleaned areas.

## 🔌 API & Services

### Supabase Edge Functions

#### submit-report
```typescript
POST /functions/v1/submit-report
Body: {
  image_base64: string
  latitude: number
  longitude: number
  notes?: string
  waste_type?: string (optional - AI generated if not provided)
  waste_volume?: string (optional)
  location_category?: string (optional)
}
Response: {
  success: boolean
  data?: {
    report_id: number
    image_url: string
    validation: {
      isWaste: boolean
      confidence: string
      reason?: string
      waste_type?: string
      waste_volume?: string
      location_category?: string
    }
  }
}
```

#### get-nearby-reports
```typescript
GET /functions/v1/get-nearby-reports?latitude={lat}&longitude={lng}&radius_km={radius}&limit={limit}
Response: {
  success: boolean
  data?: {
    reports: ReportLocation[]
    query: { latitude, longitude, radius_km }
    total_count: number
  }
}
```

### Client Services

#### authService (`lib/auth.ts`)
- `loginWithEmail(credentials)` - Login
- `registerWithEmail(data)` - Register
- `loginWithGoogle()` - OAuth Google
- `logout()` - Logout
- `getCurrentUser()` - Get current user
- `getSession()` - Get session

#### reportService (`lib/reportService.ts`)
- `submitReport(params)` - Submit report
- `fileToBase64(file)` - Convert file to base64
- `resizeImage(file)` - Resize & compress image

#### campaignService (`lib/campaignService.ts`)
- `fetchCampaigns(userId)` - Get all campaigns
- `joinCampaign(campaignId, userId)` - Join
- `leaveCampaign(campaignId, userId)` - Leave
- `checkReportHasCampaign(reportId)` - Check if report has campaign

#### expService (`lib/expService.ts`)
- `addExpForCreateReport(userId)` - Add +100 EXP
- `addExpForJoinCampaign(userId)` - Add +100 EXP
- `getUserExp(userId)` - Get user EXP
- `ensureProfileExists(userId)` - Ensure profile exists

#### leaderboardService (`lib/leaderboardService.ts`)
- `getLeaderboard(limit)` - Get top users
- `getUserRank(userId)` - Get user rank

## 📱 PWA Features

### Manifest
- **App Name**: WasteCare - Smart Waste Management
- **Theme Color**: #16a34a (emerald-600)
- **Display**: standalone
- **Orientation**: portrait
- **Icons**: 72x72 hingga 512x512px

### Service Worker
- **Caching Strategy**: NetworkFirst
- **Offline Support**: Fallback ke `/offline.html`
- **Cache Name**: offlineCache
- **Max Entries**: 200

### Installability
- Install prompt di landing page
- Add to Home Screen support
- Standalone mode di mobile

### Offline Support
- Cache static assets
- Cache API responses
- Offline fallback page
- Background sync (future)

## 📜 Scripts

```json
{
  "dev": "next dev --turbopack",           // Dev server dengan Turbopack
  "build": "next build",                    // Production build
  "start": "next start",                    // Start production server
  "lint": "eslint",                         // Run ESLint
  "build:pwa": "next build",               // Build dengan PWA
  "preview": "next build && next start"    // Build & preview
}
```

### Development
```bash
npm run dev        # Start dev server di http://localhost:3000
```

### Production
```bash
npm run build      # Build untuk production
npm run start      # Start production server
```

### Linting
```bash
npm run lint       # Check code quality
```

## 👥 Team

**WasteCare Team**
- Project Repository: [Alfian57/waste-care](https://github.com/Alfian57/waste-care)

## 🆘 Support

Jika ada pertanyaan atau issue, silakan:
1. Buka issue di GitHub
2. Hubungi team melalui email
3. Check dokumentasi Supabase dan Next.js

## 🔮 Future Roadmap

- [ ] Push notifications untuk campaign reminder
- [ ] Offline mode untuk create report
- [ ] Image upload progress indicator
- [ ] Multi-image upload per report
- [ ] Campaign completion verification
- [ ] Badge system selain EXP
- [ ] Social sharing features
- [ ] Admin dashboard
- [ ] Report verification by admin
- [ ] Campaign analytics
- [ ] Export report data

---

**Happy Coding! 🚀**

Made with ❤️ by WasteCare Team
