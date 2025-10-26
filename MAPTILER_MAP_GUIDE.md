# MapTilerMap Component - PWA Ready

## Overview

Komponen `MapTilerMap` telah diperbaiki untuk menjadi **PWA-ready** dan **safe** ketika permission belum diberikan. Komponen ini sekarang memiliki error handling yang robust, offline support, dan user experience yang lebih baik.

## ✨ Fitur Baru

### 1. **Safe Permission Handling**
- ✅ Tidak crash jika geolocation permission ditolak
- ✅ Graceful degradation - peta tetap berfungsi tanpa user location
- ✅ Optional user location marker dengan `showUserLocation` prop
- ✅ Tidak memaksa request permission jika tidak diperlukan

### 2. **PWA Support**
- ✅ **Offline Detection** - Menampilkan indicator saat offline
- ✅ **Error Recovery** - Button refresh jika terjadi error
- ✅ **Loading States** - Loading overlay dengan spinner
- ✅ **Cached Location** - Menggunakan `maximumAge` untuk cache GPS
- ✅ **Service Worker Ready** - Compatible dengan PWA caching

### 3. **Error Handling**
- ✅ API key validation
- ✅ Map initialization error handling
- ✅ Tile loading error handling
- ✅ Marker creation error handling
- ✅ User-friendly error messages dalam bahasa Indonesia

### 4. **Performance Improvements**
- ✅ Lazy loading untuk marker images
- ✅ Proper cleanup pada unmount
- ✅ Memoized comparison untuk prevent re-render
- ✅ Image error handling (`onerror` attribute)

### 5. **Better UX**
- ✅ Loading spinner saat map loading
- ✅ Error overlay dengan tombol refresh
- ✅ Offline indicator
- ✅ Permission tip untuk educate user
- ✅ User location marker dengan pulse animation

## 📖 API Documentation

### Props

```typescript
interface MapTilerMapProps {
  // API Key dari MapTiler (default: dari env variable)
  apiKey?: string;
  
  // CSS class untuk container
  className?: string;
  
  // Center koordinat peta [longitude, latitude]
  // Default: Yogyakarta [110.3695, -7.7956]
  center?: [number, number];
  
  // Zoom level (1-20)
  // Default: 12
  zoom?: number;
  
  // Array marker yang akan ditampilkan di peta
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    type: 'waste' | 'user';
    title?: string;
    location?: string;
  }>;
  
  // Callback saat marker di-click
  onMarkerClick?: (markerId: string) => void;
  
  // 🆕 Tampilkan user location marker
  showUserLocation?: boolean;
  
  // 🆕 Callback saat map selesai loading
  onMapReady?: (map: Map) => void;
  
  // 🆕 Callback saat terjadi error
  onMapError?: (error: Error) => void;
}
```

### Basic Usage

```tsx
import { MapTilerMap } from '@/components';

<MapTilerMap
  center={[110.3695, -7.7956]}
  zoom={13}
  markers={wasteMarkers}
  onMarkerClick={handleMarkerClick}
/>
```

### With User Location (PWA)

```tsx
import { MapTilerMap } from '@/components';
import { useState } from 'react';

function MapPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Get user location with permission handling
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude, 
            position.coords.latitude
          ]);
        },
        (error) => {
          // Handle error gracefully - map still works without location
          console.warn('Location access denied:', error);
        }
      );
    }
  }, []);

  return (
    <MapTilerMap
      center={userLocation || [110.3695, -7.7956]}
      zoom={13}
      markers={markers}
      showUserLocation={!!userLocation} // Show marker only if we have location
      onMarkerClick={handleClick}
    />
  );
}
```

### With Error Handling (Production Ready)

```tsx
import { MapTilerMap, MapPermissionTip } from '@/components';
import { useState, useCallback } from 'react';

function MapPage() {
  const [showTip, setShowTip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapReady = useCallback(() => {
    console.log('Map loaded successfully');
    // Show permission tip if needed
    if (!userLocation) {
      setTimeout(() => setShowTip(true), 2000);
    }
  }, [userLocation]);

  const handleMapError = useCallback((error: Error) => {
    console.error('Map error:', error);
    setError(error.message);
    // Could send to error tracking service here
  }, []);

  return (
    <div className="relative h-screen">
      <MapTilerMap
        markers={markers}
        onMarkerClick={handleClick}
        showUserLocation={true}
        onMapReady={handleMapReady}
        onMapError={handleMapError}
      />
      
      {/* Optional: Show permission tip */}
      <MapPermissionTip 
        show={showTip}
        onDismiss={() => setShowTip(false)}
      />
    </div>
  );
}
```

## 🎨 UI States

### 1. Loading State
```
┌─────────────────────────────────┐
│                                 │
│          ⟳ Spinning             │
│       Memuat peta...            │
│                                 │
└─────────────────────────────────┘
```

### 2. Error State
```
┌─────────────────────────────────┐
│          ⚠️ Error Icon          │
│   Gagal Memuat Peta             │
│   [Error message here]          │
│   [Refresh Halaman Button]     │
└─────────────────────────────────┘
```

### 3. Offline State
```
┌─────────────────────────────────┐
│  📡 Mode Offline (top banner)   │
│                                 │
│        [Map content]            │
│                                 │
└─────────────────────────────────┘
```

### 4. Permission Tip (Optional)
```
┌─────────────────────────────────┐
│        [Map content]            │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 💡 Tips Penggunaan Peta   │ │
│  │ Izinkan akses lokasi...   │ │
│  │ [Mengerti] [Jangan lagi]  │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

## 🔒 Permission Handling

### Geolocation Permission States

| State | Behavior |
|-------|----------|
| **Granted** | User location marker ditampilkan dengan pulse animation |
| **Denied** | Peta tetap berfungsi, marker tidak ditampilkan, optional tip muncul |
| **Prompt** | Permission belum di-request, tunggu user action |
| **Unsupported** | Browser tidak support geolocation, peta tetap berfungsi |

### Best Practices

1. **Jangan Force Request Permission**
   ```tsx
   // ❌ BAD - Force request di mount
   useEffect(() => {
     navigator.geolocation.getCurrentPosition(...);
   }, []);
   
   // ✅ GOOD - Request when user needs it
   <MapTilerMap 
     showUserLocation={userWantsLocation} 
   />
   ```

2. **Handle Permission Denial Gracefully**
   ```tsx
   // ✅ Map still works without user location
   <MapTilerMap
     center={userLocation || defaultCenter}
     showUserLocation={!!userLocation}
   />
   ```

3. **Provide User Education**
   ```tsx
   // ✅ Show tip to educate user
   <MapPermissionTip 
     show={!userLocation && mapReady}
     onDismiss={handleDismiss}
   />
   ```

## 🌐 PWA Considerations

### Offline Support

Map tiles akan di-cache oleh browser/service worker. Jika offline:
- Map tiles yang sudah di-cache akan tetap tampil
- New tiles tidak akan load (gray tiles)
- Offline indicator muncul di top

### Service Worker Configuration

```javascript
// In your service worker (sw.js)
self.addEventListener('fetch', (event) => {
  // Cache MapTiler tiles
  if (event.request.url.includes('api.maptiler.com')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open('map-tiles').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

### Manifest Configuration

```json
{
  "name": "WasteCare",
  "short_name": "WasteCare",
  "start_url": "/dashboard",
  "display": "standalone",
  "permissions": [
    "geolocation"
  ],
  "icons": [...]
}
```

## 🐛 Troubleshooting

### Issue: Map tidak muncul (blank)

**Possible Causes:**
1. API key tidak valid atau missing
2. Network offline
3. Browser tidak support WebGL

**Solutions:**
1. Check console untuk error messages
2. Verify `NEXT_PUBLIC_MAPTILER_API_KEY` di `.env.local`
3. Test di browser lain

### Issue: User location tidak muncul

**Possible Causes:**
1. Permission denied
2. GPS tidak aktif
3. `showUserLocation` prop tidak di-set

**Solutions:**
1. Check permission di browser settings
2. Aktifkan GPS di device
3. Set `showUserLocation={true}` props

### Issue: Map lambat loading

**Possible Causes:**
1. Terlalu banyak markers
2. Network lambat
3. Tile caching tidak optimal

**Solutions:**
1. Implement marker clustering untuk banyak markers
2. Reduce tile quality untuk connection lambat
3. Configure service worker caching

## 📊 Performance Tips

1. **Memoize Markers**
   ```tsx
   const markers = useMemo(() => 
     reports.map(r => ({...})), 
     [reports]
   );
   ```

2. **Lazy Load Images**
   ```tsx
   // Already implemented with loading="lazy"
   <img loading="lazy" src="..." />
   ```

3. **Debounce Updates**
   ```tsx
   const debouncedCenter = useDebounce(userLocation, 500);
   <MapTilerMap center={debouncedCenter} />
   ```

## 🔄 Migration Guide

### From Old Version

```diff
  <MapTilerMap
    markers={markers}
    onMarkerClick={handleClick}
+   showUserLocation={!!userLocation}
+   onMapReady={handleReady}
+   onMapError={handleError}
  />
```

### Add Permission Tip

```diff
+ import { MapPermissionTip } from '@/components';

  return (
    <div className="relative">
      <MapTilerMap ... />
+     <MapPermissionTip 
+       show={showTip}
+       onDismiss={() => setShowTip(false)}
+     />
    </div>
  );
```

## 🎯 Testing Checklist

- [ ] Test dengan permission granted
- [ ] Test dengan permission denied
- [ ] Test dengan permission prompt
- [ ] Test di mode offline
- [ ] Test error handling (invalid API key)
- [ ] Test dengan banyak markers (100+)
- [ ] Test di mobile device
- [ ] Test di iOS Safari
- [ ] Test di Android Chrome
- [ ] Test reload setelah offline → online
- [ ] Test PWA install dan offline usage

## 📝 Related Components

- **`PermissionGuard`** - Untuk handle permission di halaman lain
- **`MapPermissionTip`** - Tip untuk educate user tentang location permission
- **`PhotoCapture`** - Untuk handle camera permission

---

**Updated:** October 26, 2025  
**Version:** 2.0.0 (PWA Ready)
