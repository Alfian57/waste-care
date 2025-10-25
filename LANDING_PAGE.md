# Landing Page - Documentation

## Overview
Landing page untuk WasteCare yang menampilkan informasi umum tentang aplikasi, peta sebaran sampah, dan statistik kota dengan pengelolaan sampah terbaik.

## Struktur File

```
src/app/landing/
├── page.tsx                  # Main landing page component
├── index.ts                  # Exports untuk semua komponen
├── Navbar.tsx               # Navigation bar dengan scroll effect
├── HeroSection.tsx          # Hero section dengan CTA
├── MapsSection.tsx          # Peta sebaran sampah
├── StatisticsSection.tsx    # Statistik kota terbaik
└── Footer.tsx               # Footer component
```

## Components

### 1. Navbar
**File:** `Navbar.tsx`

**Features:**
- Fixed position dengan transparent background saat di top
- Berubah menjadi solid white dengan shadow saat scroll
- Smooth scroll ke section
- Responsive design
- Link ke halaman login

**Props:**
```typescript
interface NavbarProps {
  isScrolled?: boolean;
}
```

### 2. HeroSection
**File:** `HeroSection.tsx`

**Features:**
- Gradient background dengan pattern
- Animated scroll indicator
- CTA buttons untuk scroll ke Maps dan Statistics
- Statistics cards (Total Laporan, Campaign, Pengguna)
- Feature highlights cards
- Responsive grid layout

**Sections:**
- Tagline dan deskripsi WasteCare
- CTA buttons (Lihat Peta Sampah, Lihat Statistik)
- Mini statistics (Laporan Aktif, Campaign Selesai, Pengguna Aktif)
- Feature cards showcase

### 3. MapsSection
**File:** `MapsSection.tsx`

**Features:**
- Fetch data reports dari Supabase
- Display peta menggunakan MapTilerMap component
- Statistics cards berdasarkan jenis sampah
- Loading state
- Info box

**Data Fetching:**
```typescript
// Fetch dari tabel reports
const { data, error } = await supabase
  .from('reports')
  .select('id, lattitude, longitude, waste_type, location_category, image_urls')
  .limit(100);
```

**Statistics Calculated:**
- Total laporan
- Sampah organik
- Sampah anorganik
- Sampah berbahaya
- Sampah campuran

### 4. StatisticsSection
**File:** `StatisticsSection.tsx`

**Features:**
- Top 5 kota dengan pengelolaan sampah terbaik
- Ranking dengan badge berwarna (Gold, Silver, Bronze)
- Progress bar untuk skor kebersihan
- Mini statistics per kota (Campaign Selesai, Laporan Aktif, Area Dibersihkan)
- Achievement cards
- Info box tentang cara perhitungan skor

**Data Structure:**
```typescript
interface CityStatistic {
  rank: number;
  city: string;
  province: string;
  score: number;
  completedCampaigns: number;
  activeReports: number;
  cleanedAreas: number;
}
```

**Current Status:**
- ⚠️ Menggunakan dummy data
- TODO: Implementasi algoritma perhitungan skor dari database
- TODO: Fetch data real-time dari campaign completion

### 5. Footer
**File:** `Footer.tsx`

**Features:**
- Brand section dengan logo dan deskripsi
- Social media links (Facebook, Twitter, Instagram)
- Quick links navigation
- Features list
- Contact information
- Bottom bar dengan copyright dan legal links

**Sections:**
- Brand & Social Media
- Navigation Links
- Features List
- Contact Info
- Copyright & Legal

## Routes

### Landing Page Route
- **URL:** `/`
- **Access:** Public (tidak perlu login)
- **Behavior:**
  - User yang **belum login** → Menampilkan landing page
  - User yang **sudah login** → Redirect ke `/dashboard`

### Login Route
- **URL:** `/login`
- **Access:** Public
- **Redirect:** User yang sudah login akan redirect ke `/dashboard`

## Scroll Behavior

### Smooth Scroll Implementation
```typescript
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

### Section IDs
- `#hero` - Hero Section
- `#maps` - Maps Section
- `#statistics` - Statistics Section

## Styling

### Color Scheme
- Primary: `emerald-600` (#16a34a)
- Secondary: `teal-700`
- Background gradients: `from-emerald-600 via-emerald-700 to-teal-700`
- Text: `gray-900`, `gray-600`
- Success: `emerald-500`
- Info: `blue-600`
- Warning: `orange-600`
- Danger: `red-600`

### Responsive Breakpoints
- Mobile: Default
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)

### Consistent Elements
- Border radius: `rounded-xl` (12px), `rounded-2xl` (16px)
- Shadows: `shadow-sm`, `shadow-md`, `shadow-xl`
- Spacing: Menggunakan Tailwind spacing scale (4, 6, 8, 12, 16, 20)
- Font: Default system font stack

## Icons

### SVG Icons Used
Semua icon menggunakan Heroicons (SVG inline):
- Map marker (location)
- Check circle (completed)
- Users (participants)
- Chart bar (statistics)
- Trophy/Medal (achievements)
- Social media icons
- Contact icons

## Integration Points

### Supabase
**File:** `MapsSection.tsx`
```typescript
import { supabase } from '@/lib/supabase';

// Fetch reports
const { data, error } = await supabase
  .from('reports')
  .select('id, lattitude, longitude, waste_type, location_category, image_urls')
  .limit(100);
```

### MapTilerMap Component
```typescript
<MapTilerMap
  markers={markers}
  onMarkerClick={() => {}}
/>
```

### Next.js Router
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/login');
```

## TODO - Future Enhancements

### StatisticsSection
1. **Backend Integration**
   - Create service untuk menghitung skor kota
   - Algoritma: `(completed_campaigns * weight1) + (response_time * weight2) + (cleanup_rate * weight3)`
   - Real-time data fetch dari database

2. **Database Schema**
```sql
-- Create city_statistics view or table
create view city_statistics as
select 
  city,
  province,
  count(distinct c.id) as completed_campaigns,
  count(distinct r.id) as active_reports,
  count(distinct cleanup_areas) as cleaned_areas,
  calculate_score() as score
from campaigns c
join reports r on ...
group by city, province
order by score desc
limit 5;
```

3. **Service Function**
```typescript
// src/lib/cityStatisticsService.ts
export async function getTopCities(limit: number = 5) {
  const { data, error } = await supabase
    .from('city_statistics')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);
  
  return data;
}
```

### MapsSection
1. **Performance**
   - Add pagination untuk markers
   - Implement clustering untuk banyak markers
   - Add filter by waste type
   - Add search by location

2. **Features**
   - Click marker untuk lihat detail
   - Integrate dengan BottomSheet component
   - Add legend untuk marker types

### General
1. **SEO**
   - Add meta tags
   - Add Open Graph tags
   - Add structured data

2. **Analytics**
   - Track button clicks
   - Track scroll behavior
   - Track section views

3. **A/B Testing**
   - Test different CTA texts
   - Test color schemes
   - Test layouts

## Testing Checklist

- [ ] Landing page loads tanpa error
- [ ] Navbar berubah style saat scroll
- [ ] Smooth scroll ke semua section berfungsi
- [ ] Maps section menampilkan markers dari database
- [ ] Statistics section menampilkan ranking kota
- [ ] Footer links berfungsi
- [ ] CTA buttons redirect dengan benar
- [ ] Responsive di mobile, tablet, desktop
- [ ] Loading states tampil dengan baik
- [ ] Error handling untuk failed requests

## Performance Considerations

1. **Dynamic Imports**
   - MapTilerMap di-import secara dynamic untuk avoid SSR issues
   - `{ ssr: false }` untuk client-side only rendering

2. **Image Optimization**
   - TODO: Use Next.js Image component untuk hero images
   - TODO: Lazy load images di maps section

3. **Code Splitting**
   - Setiap section adalah component terpisah
   - Auto code-splitting by Next.js

## Accessibility

- [ ] Semantic HTML elements
- [ ] Alt text untuk images
- [ ] ARIA labels untuk buttons
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Color contrast compliance

