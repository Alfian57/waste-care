# Halaman Tentang Kami

## Overview
Halaman "Tentang Kami" adalah halaman publik yang dapat diakses melalui route `/tentang`. Halaman ini memberikan informasi lengkap tentang WasteCare, fitur-fitur unggulan, tim pengembang, dan ajakan untuk bergabung.

## Route
- **URL**: `/tentang`
- **Access**: Public (tidak memerlukan autentikasi)
- **Added to publicRoutes**: Ya (di `ProtectedRoute.tsx`)

## Struktur File
```
src/app/tentang/
├── page.tsx                          # Main page component
└── components/
    ├── index.ts                      # Component exports
    ├── HeroSection.tsx              # Hero section dengan deskripsi
    ├── FeaturesSection.tsx          # Fitur unggulan aplikasi
    ├── TeamSection.tsx              # Tim pengembang
    └── ClosingSection.tsx           # Penutup dan CTA
```

## Sections

### 1. Hero Section (`HeroSection.tsx`)
**Purpose**: Memperkenalkan WasteCare dan memberikan overview aplikasi

**Features**:
- Badge "Tentang WasteCare" dengan emoji 🌱
- Heading besar dengan gradient text
- Deskripsi singkat tentang WasteCare
- Card dengan informasi detail tentang aplikasi
- Statistics grid (4 stats):
  - Tahun Berdiri: 2024
  - Pengguna Aktif: 12K+
  - Campaign Selesai: 567
  - Laporan Ditangani: 1,234
- Scroll indicator dengan bounce animation

**Design**:
- Background: Gradient emerald-600 → emerald-700 → teal-700
- Pattern: White blur circles untuk depth
- Glass morphism effects dengan backdrop-blur
- Responsive layout dengan max-width container

### 2. Features Section (`FeaturesSection.tsx`)
**Purpose**: Menampilkan fitur-fitur unggulan aplikasi

**Features** (6 fitur):
1. **Lapor Sampah Mudah** (emerald)
   - Icon: Check circle
   - Deskripsi: Lapor dengan foto, GPS, estimasi volume

2. **Campaign Gotong Royong** (blue)
   - Icon: Users
   - Deskripsi: Buat/gabung kampanye dengan koordinasi mudah

3. **Peta Interaktif** (orange)
   - Icon: Map
   - Deskripsi: Lihat lokasi sampah real-time dengan filter

4. **Notifikasi Real-time** (purple)
   - Icon: Bell
   - Deskripsi: Update status laporan dan campaign terdekat

5. **Statistik & Progress** (teal)
   - Icon: Chart
   - Deskripsi: Dashboard dengan pencapaian dan dampak

6. **Keamanan Data** (red)
   - Icon: Lock
   - Deskripsi: Enkripsi standar industri untuk privasi

**Layout**:
- Grid responsive: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Each card: hover effects dengan scale dan shadow
- Color-coded icons dengan dynamic classes
- Bottom CTA card dengan gradient background

**Design**:
- White background
- Cards dengan border hover transition
- Icon containers dengan colored backgrounds
- Hover: scale(1.1) pada icons

### 3. Team Section (`TeamSection.tsx`)
**Purpose**: Memperkenalkan tim pengembang WasteCare

**Team Members**:
1. **Fardila Bintang Adinata**
   - Role: Full Stack Developer
   - Focus: Backend & database integration
   - Photo: Reserved at `/images/team/fardila.jpg`

2. **Alfian Gading**
   - Role: Frontend Developer
   - Focus: UI development & responsiveness
   - Photo: Reserved at `/images/team/alfian.jpg`

3. **Andhika Prasetyo**
   - Role: UI/UX Designer
   - Focus: User experience design
   - Photo: Reserved at `/images/team/andhika.jpg`

**Card Components**:
- Photo placeholder: Gradient emerald → teal dengan user icon
- Decorative blur circles untuk visual interest
- Role badge dengan emerald-100 background
- Social links placeholder (GitHub, LinkedIn)

**Layout**:
- Grid responsive: 1 col → 2 cols → 3 cols
- Cards dengan image height 320px (h-80)
- Hover effects: border color change + shadow

**Fun Fact Card**:
- Gradient background emerald-50 → teal-50
- Emoji 💡 untuk visual appeal
- Text about team's passion

### 4. Closing Section (`ClosingSection.tsx`)
**Purpose**: Kata penutup dan ajakan untuk mulai berpartisipasi

**Components**:

**Main Card**:
- Large gradient card (emerald → teal)
- Icon dalam glass morphism container
- Heading: "Mari Bersama Ciptakan Perubahan"
- Description tentang dampak dan ajakan
- Stats grid (3 items):
  - 100% Gratis Digunakan
  - 24/7 Layanan Aktif
  - ∞ Dampak Positif
- CTA buttons:
  - "Daftar Sekarang" → `/register` (white button)
  - "Kembali ke Beranda" → `/` (outline button)

**Contact Cards** (3 cards):
1. Email: support@wastecare.id
2. Live Chat: Senin-Jumat 09:00-17:00
3. FAQ & Bantuan

**Final Message**:
- Reminder dengan emoji 🌱
- Text tentang langkah kecil yang bermakna
- Thank you message

**Design**:
- Main card: Full-width gradient dengan patterns
- Contact cards: Grid 3 columns responsive
- Icons dengan colored backgrounds (emerald, blue, purple)

## Navigation Integration

### Navbar
File: `src/app/landing/Navbar.tsx`

**Added Button**:
```tsx
<button
  onClick={() => router.push('/tentang')}
  className={`font-medium transition-colors ${
    isScrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white hover:text-emerald-200'
  }`}
>
  Tentang
</button>
```

**Position**: Between "Statistik" and "Masuk" buttons

### Footer
File: `src/app/landing/Footer.tsx`

**Added Link**:
```tsx
<li>
  <button
    onClick={() => router.push('/tentang')}
    className="hover:text-emerald-400 transition-colors text-sm"
  >
    Tentang
  </button>
</li>
```

**Position**: In "Navigasi" section, between "Statistik" and "Masuk"

## Design System

### Colors
- **Primary**: emerald-600, emerald-700, teal-700
- **Accents**: blue-600, orange-600, purple-600, teal-600, red-600
- **Backgrounds**: 
  - Hero: gradient-to-br from-emerald-600 via-emerald-700 to-teal-700
  - Features: white
  - Team: gradient-to-b from-gray-50 to-white
  - Closing: white
- **Glass morphism**: bg-white bg-opacity-10/20/30 with backdrop-blur

### Typography
- **Headings**: 
  - H1: text-5xl md:text-6xl font-bold
  - H2: text-4xl md:text-5xl font-bold
  - H3: text-2xl font-bold
- **Body**: text-xl leading-relaxed (hero), text-gray-600 (content)
- **Small**: text-sm

### Spacing
- **Section padding**: py-20
- **Container**: container mx-auto px-6
- **Card padding**: p-6, p-8, p-12 (varies by component)
- **Gaps**: gap-4, gap-6, gap-8 (responsive)

### Components

#### Badges
```tsx
<div className="inline-block px-4 py-2 bg-white bg-opacity-30 rounded-full backdrop-blur-md border border-white border-opacity-40">
  <span className="text-sm font-semibold text-white">🌱 Text</span>
</div>
```

#### Feature Cards
```tsx
<div className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl">
  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
    {icon}
  </div>
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

#### Team Cards
```tsx
<div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-2xl">
  <div className="h-80 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500">
    {/* Photo placeholder */}
  </div>
  <div className="p-6">
    {/* Member info */}
  </div>
</div>
```

#### CTA Buttons
```tsx
// Primary
<a className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-xl">

// Secondary
<a className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-emerald-700 transition-all">
```

### Responsive Breakpoints
- **Mobile**: Default (single column)
- **Tablet**: md: (768px) - 2 columns
- **Desktop**: lg: (1024px) - 3 columns

## Icons
All icons use Heroicons (Tailwind's default SVG icons):
- User profile: User circle
- Email: Envelope
- Map: Map pin
- Check: Check circle
- Users: Users group
- Lock: Lock closed
- Bell: Bell
- Chart: Chart bars
- Globe: Globe
- LinkedIn: Custom SVG path
- GitHub: Custom SVG path

## Future Enhancements

### TODO: Team Photos
- Replace gradient placeholders dengan foto asli
- Path: `/public/images/team/`
- Files needed:
  - `fardila.jpg`
  - `alfian.jpg`
  - `andhika.jpg`

### TODO: Social Links
- Update href="#" dengan URL social media asli
- GitHub profiles untuk masing-masing developer
- LinkedIn profiles

### TODO: Contact Integration
- Email link → mailto:support@wastecare.id
- Live chat integration dengan chat widget
- Link FAQ ke halaman bantuan (if exists)

## Testing Checklist

- [x] Route `/tentang` accessible without auth
- [x] All sections render correctly
- [x] Responsive layout on mobile/tablet/desktop
- [x] Navigation from landing page navbar works
- [x] Navigation from footer works
- [x] "Kembali ke Beranda" button works
- [x] "Daftar Sekarang" button routes to `/register`
- [x] Scroll indicator animates
- [x] All hover effects work
- [x] Glass morphism effects render properly
- [x] No TypeScript errors
- [x] Icons display correctly

## Performance Considerations

- **Client-side only**: All components use 'use client'
- **No heavy dependencies**: Pure React + Next.js
- **Optimized images**: Currently using placeholders (will need optimization when real photos added)
- **CSS animations**: Hardware-accelerated transforms (scale, opacity)
- **Lazy loading**: Could implement intersection observer for sections (future)

## Accessibility

- Semantic HTML structure
- Button elements for clickable actions
- Alt text for icons (aria-label recommended for future)
- Color contrast meets WCAG guidelines
- Focus states on interactive elements

## Related Files Modified

1. `src/app/landing/Navbar.tsx` - Added "Tentang" button
2. `src/app/landing/Footer.tsx` - Added "Tentang" link in navigation
3. `src/components/ProtectedRoute.tsx` - Added `/tentang` to publicRoutes

## Usage Example

```tsx
// Access from landing page navbar
<button onClick={() => router.push('/tentang')}>
  Tentang
</button>

// Direct URL
// https://yourdomain.com/tentang

// Link in footer
<button onClick={() => router.push('/tentang')}>
  Tentang
</button>
```
