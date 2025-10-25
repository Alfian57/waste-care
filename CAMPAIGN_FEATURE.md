# Campaign Feature - Documentation

## Overview
Fitur campaign telah ditambahkan ke aplikasi WasteCare untuk memungkinkan pengguna membuat dan bergabung dengan kampanye pembersihan sampah.

## Fitur yang Ditambahkan

### 1. **Bottom Sheet Enhancement**
- Menambahkan tombol "Buat Campaign" jika belum ada campaign untuk lokasi tersebut
- Menambahkan tombol "Gabung Campaign" jika sudah ada campaign untuk lokasi tersebut
- Tombol-tombol ini muncul di detail marker pada dashboard map

**File yang dimodifikasi:**
- `src/app/components/BottomSheet.tsx`
- `src/app/dashboard/DashboardBottomSheet.tsx`

### 2. **Halaman Buat Campaign**
Halaman baru untuk membuat campaign dengan fitur:
- Form input lengkap (judul, tanggal, waktu, max partisipan)
- Pilihan tipe penyelenggara (Pribadi atau Yayasan/Organisasi)
- Deskripsi campaign (opsional)
- Informasi lokasi otomatis dari report yang dipilih
- Validasi form lengkap
- Toast notification untuk feedback

**Route:** `/dashboard/buat-campaign`

**Query Parameters:**
- `reportId`: ID report yang akan dijadikan campaign
- `lat`: Latitude lokasi
- `lng`: Longitude lokasi
- `location`: Nama lokasi

**File:** `src/app/dashboard/buat-campaign/page.tsx`

### 3. **Routing ke Campaign Detail**
- Ketika tombol "Gabung Campaign" diklik, user diarahkan ke halaman campaign dengan detail campaign terbuka
- Menggunakan query parameter `campaignId` untuk membuka modal detail campaign

**File yang dimodifikasi:**
- `src/app/campaign/page.tsx`

### 4. **Database Types Update**
Menambahkan tipe database untuk tabel campaigns:

**Fields:**
- `id`: UUID (primary key)
- `title`: String - Judul campaign
- `description`: String - Deskripsi campaign
- `location_name`: String - Nama lokasi
- `latitude`: Number - Koordinat latitude
- `longitude`: Number - Koordinat longitude
- `date`: String - Tanggal campaign
- `time`: String - Waktu campaign
- `max_participants`: Number - Maksimal partisipan
- `participants`: Number - Jumlah partisipan saat ini
- `status`: Enum - 'upcoming' | 'ongoing' | 'completed'
- `image_url`: String - URL gambar campaign
- `organizer`: String - Nama penyelenggara
- `organizer_type`: Enum - 'personal' | 'organization'
- `waste_types`: String[] - Array jenis sampah
- `estimated_volume`: String - Estimasi volume sampah
- `report_ids`: Number[] - Array ID report yang terkait
- `created_by`: String - User ID pembuat
- `created_at`: String - Timestamp

**File:** `src/types/database.types.ts`

## User Flow

### Flow 1: Membuat Campaign Baru
1. User melihat marker sampah di dashboard map
2. User klik marker untuk melihat detail
3. Bottom sheet muncul dengan tombol "Buat Campaign"
4. User klik "Buat Campaign"
5. Redirect ke `/dashboard/buat-campaign?reportId=xxx&lat=xxx&lng=xxx&location=xxx`
6. User mengisi form campaign:
   - Judul campaign
   - Tanggal dan waktu
   - Maksimal partisipan (minimal 2)
   - Tipe penyelenggara (Pribadi/Organisasi)
   - Nama penyelenggara
   - Deskripsi (opsional)
7. User klik "Buat Campaign"
8. Campaign disimpan (TODO: implementasi Supabase)
9. Redirect ke halaman `/campaign`

### Flow 2: Bergabung dengan Campaign
1. User melihat marker sampah di dashboard map
2. User klik marker yang sudah memiliki campaign
3. Bottom sheet muncul dengan tombol "Gabung Campaign"
4. User klik "Gabung Campaign"
5. Redirect ke `/campaign?campaignId=xxx`
6. Modal detail campaign otomatis terbuka
7. User dapat melihat detail dan klik "Ikut Bergabung"

## TODO - Implementasi Backend

### Supabase Integration Needed:

1. **Create Campaign Table**
```sql
create table campaigns (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  location_name text not null,
  latitude double precision not null,
  longitude double precision not null,
  date text not null,
  time text not null,
  max_participants integer not null,
  participants integer default 0,
  status text check (status in ('upcoming', 'ongoing', 'completed')) default 'upcoming',
  image_url text not null,
  organizer text not null,
  organizer_type text check (organizer_type in ('personal', 'organization')) not null,
  waste_types text[] not null,
  estimated_volume text not null,
  report_ids integer[] not null,
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

2. **Create Campaign Service**
- File: `src/lib/campaignService.ts`
- Functions:
  - `createCampaign(data)`: Membuat campaign baru
  - `getCampaignByReportId(reportId)`: Cek apakah report sudah punya campaign
  - `joinCampaign(campaignId, userId)`: Join campaign
  - `leaveCampaign(campaignId, userId)`: Leave campaign

3. **Update DashboardBottomSheet.tsx**
- Implementasi fetch campaign berdasarkan reportId
- Set `hasCampaign` dan `campaignId` berdasarkan data real dari database

4. **Update buat-campaign/page.tsx**
- Implementasi submit campaign ke Supabase
- Upload image (jika ada)
- Handle error dengan proper error messages

## Testing Checklist

- [ ] Bottom sheet menampilkan tombol "Buat Campaign" untuk report tanpa campaign
- [ ] Bottom sheet menampilkan tombol "Gabung Campaign" untuk report dengan campaign
- [ ] Form buat campaign ter-validasi dengan benar
- [ ] Redirect ke campaign page setelah submit
- [ ] Query parameter campaignId membuka detail campaign
- [ ] Tipe penyelenggara (Pribadi/Organisasi) berfungsi
- [ ] Date picker tidak bisa pilih tanggal lampau
- [ ] Minimal partisipan adalah 2 orang

## Notes
- Saat ini masih menggunakan dummy data untuk campaign (dari `useCampaigns` hook)
- Implementasi backend Supabase masih TODO
- Image URL untuk campaign saat ini hardcoded, perlu implementasi upload
