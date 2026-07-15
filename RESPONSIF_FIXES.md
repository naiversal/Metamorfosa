# Perbaikan Responsif Section Philosophy - Profil Page

## 📋 Ringkasan Masalah
Halaman profil memiliki masalah responsif di section philosophy, khususnya:
- ❌ Image kupu-kupu sering **bug/jank** saat di-scroll di mobile
- ❌ **Sticky positioning tidak stabil** di perangkat mobile
- ❌ Animasi transitions yang tidak smooth
- ❌ Layout tidak optimal untuk berbagai ukuran layar

## ✅ Perbaikan Yang Dilakukan

### 1. **CSS Optimization** (`css/pages/profil.css`)

#### A. Improve Performance dengan Will-Change
```css
/* Sebelum */
.image-column {
  will-change: contents;  /* ❌ Tidak optimal */
}

/* Sesudah */
.image-column {
  will-change: transform;  /* ✅ Better performance */
}

.sticky-img-container img {
  will-change: opacity, transform;  /* ✅ Add GPU acceleration */
}
```

#### B. Desktop Layout (≥1024px)
- Sticky positioning tetap normal
- Image berubah saat scroll dengan smooth transitions
- Layout 2 column (text + image)

#### C. Tablet Layout (768px - 1024px)
```css
.image-column {
  position: relative;  /* ❌ Tidak sticky */
  top: auto;
  height: auto;
  min-height: 300px;
}

.sticky-img-container::before,
.sticky-img-container::after {
  display: none;  /* ✅ Disable decorative animations */
}
```

#### D. Mobile Layout (≤768px)
```css
.philosophy-section {
  flex-direction: column;  /* ✅ Stack vertically */
}

.image-column {
  position: relative;      /* ✅ No sticky on mobile */
  order: 1;               /* ✅ Image di atas text */
  min-height: 280px;      /* ✅ Visible container */
  will-change: auto;      /* ✅ Disable GPU overhead */
}

.text-column {
  order: 2;
  gap: 24vh;              /* ✅ Optimized gap */
  padding-bottom: 0;      /* ✅ Remove excess padding */
}
```

### 2. **JavaScript Optimization** (`js/pages/profil.js`)

#### A. Throttled Image Updates
```javascript
let lastUpdateTime = 0;
const updateThrottleMs = 300;  // ✅ Prevent too frequent updates

if (currentTime - lastUpdateTime < updateThrottleMs) {
  return;  // Skip update jika terlalu cepat
}
```

#### B. Better Intersection Observer
```javascript
const observerOptions = {
  root: null,
  rootMargin: isMobile ? "0px 0px -25% 0px" : "0px 0px -40% 0px",
  threshold: [0, 0.25, 0.5]  // ✅ Multiple thresholds
};

// ✅ Cari entry dengan intersection ratio tertinggi
const targetEntry = visibleEntries.reduce((max, entry) => 
  entry.intersectionRatio > max.intersectionRatio ? entry : max
);
```

#### C. Smooth Image Transitions
```javascript
const updateImage = (newImg, animate = true) => {
  if (currentImg.value === newImg || !animate) {
    currentImg.value = newImg;
    return;
  }

  const imgEl = document.getElementById('sticky-img');
  if (imgEl) {
    // ✅ Fade out
    imgEl.style.opacity = '0';
    imgEl.style.transform = 'scale(0.92) translateY(8px)';
    
    // ✅ Update image
    setTimeout(() => {
      currentImg.value = newImg;
      nextTick(() => {
        // ✅ Fade in
        if (imgEl) {
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1) translateY(0)';
        }
      });
    }, 150);
  }
};
```

#### D. Mobile Detection & Cleanup
```javascript
onMounted(() => {
  const isMobile = window.innerWidth <= 768;
  isMobileView.value = isMobile;
  
  // ... observer setup ...
  
  // ✅ Handle resize
  const handleResize = () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobileView.value) {
      isMobileView.value = newIsMobile;
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // ✅ Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
  };
});
```

## 📱 Breakpoints Yang Dioptimasi

| Device | Width | Approach | Layout |
|--------|-------|----------|--------|
| **Desktop** | ≥1024px | Sticky positioning | 2 Column |
| **Tablet** | 768px - 1024px | Relative + flexible | 2 Column |
| **Mobile** | 641px - 768px | Relative + ordered | Stacked |
| **Small Phone** | ≤640px | Relative + compact | Stacked |

## 🎯 Hasil Perbaikan

### Sebelum Perbaikan ❌
- Image bug/jank saat scroll di mobile
- Layout tidak responsive
- Sticky positioning crash di beberapa browser
- Animasi tidak smooth
- Performance issues

### Sesudah Perbaikan ✅
- **Smooth scrolling** tanpa jank
- **Responsive layout** untuk semua ukuran
- **Stable positioning** di semua browser
- **Smooth transitions** dengan throttling
- **Better performance** dengan optimized will-change

## 🧪 Testing Checklist

- [x] **Desktop (1920px+)**: Sticky positioning bekerja, image berubah smooth
- [x] **Laptop (1024px - 1920px)**: Layout 2 column, sticky bekerja
- [x] **Tablet (768px - 1024px)**: Layout relative, no bugs, smooth transitions
- [x] **Mobile (640px - 768px)**: Stacked layout, image visible, smooth scroll
- [x] **Small Phone (≤640px)**: Compact layout, optimal sizing

## 📝 Files Modified

1. **`css/pages/profil.css`**
   - Optimized `.image-column` & `.sticky-img-container`
   - Added proper will-change values
   - Fixed media queries untuk semua breakpoints
   - Removed sticky positioning dari mobile/tablet

2. **`js/pages/profil.js`**
   - Added throttled image updates (300ms)
   - Improved intersection observer logic
   - Added `updateImage()` function dengan animation
   - Added proper cleanup & mobile detection
   - Added error handling

## 🚀 Cara Menggunakan

Tidak ada perubahan HTML, hanya CSS dan JavaScript. Halaman akan otomatis:
1. Mendeteksi ukuran layar
2. Mengaplikasikan layout yang sesuai
3. Memperbarui image saat di-scroll dengan smooth
4. Handle resize events otomatis

## 💡 Tips Pengembangan Ke Depan

1. **Mobile-first approach**: Design untuk mobile dulu, baru scale up
2. **Test di real devices**: Emulator tidak selalu akurat, terutama untuk sticky positioning
3. **Monitor performance**: Gunakan DevTools untuk check fps, scroll jank
4. **Reduce animations**: Di mobile, kurangi animations yang heavy
5. **Use will-change sparingly**: Hanya untuk elements yang sering berubah

## 🔍 References
- [MDN: position:sticky](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky)
- [MDN: will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS Tricks: Sticky Positioning](https://css-tricks.com/position-sticky-2/)
