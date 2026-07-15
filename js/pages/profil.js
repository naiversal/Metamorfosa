/**
 * profil.js — BEM KM UNMUL | Kabinet Metamorfosa
 * ─────────────────────────────────────────────────
 * Vue 3 Composition API
 * Optimasi:
 *  1. Intersection Observer throttle + highest-ratio strategy
 *  2. Image swap via reactive currentImg (Vue <Transition> handles crossfade)
 *  3. Mobile-aware observer margins
 *  4. scrollToItem() untuk philosophy dots navigation
 *  5. Cleanup on unmount via returned teardown fn
 *  6. About cards data driven dari JS (mudah diubah)
 *  7. Performance: passive scroll listeners, will-change hints
 */

const { createApp, ref, onMounted, onBeforeUnmount, nextTick } = Vue;

createApp({
  setup() {
    /* ─────────────────────────────────────
       SHARED GLOBAL STATE (from global.js)
    ───────────────────────────────────── */
    const global = sharedSetup();

    /* ─────────────────────────────────────
       LOCAL STATE
    ───────────────────────────────────── */
    const activeIndex       = ref(0);
    const currentImg        = ref('../images/emas.png');
    const isMobileView      = ref(false);
    const philosophyItemRefs = ref([]);   // collected via :ref binding in template

    /* ─────────────────────────────────────
       STATIC DATA
    ───────────────────────────────────── */
    const aboutCards = ref([
      {
        icon: 'fas fa-bullseye',
        title: 'Misi Kami',
        desc: 'Menjadi katalis perubahan positif dengan strategi yang inklusif dan inovatif dalam memperjuangkan kepentingan mahasiswa di berbagai isu sosial dan lingkungan.'
      },
      {
        icon: 'fas fa-star',
        title: 'Dedikasi',
        desc: 'Memberikan pelayanan advokasi yang efektif, responsif, dan inovatif untuk meningkatkan kesejahteraan serta kemakmuran seluruh mahasiswa Universitas Mulawarman.'
      },
      {
        icon: 'fas fa-handshake',
        title: 'Kolaborasi',
        desc: 'Membangun relasi berkelanjutan melalui sinergi, koordinasi, dan kolaborasi dengan berbagai mitra strategis untuk mencapai tujuan bersama yang bermanfaat.'
      }
    ]);

    const filosofi = ref([
      {
        title: 'Filosofi Logo Metamorfosa',
        img:   '../images/emas.png',
        desc:  null
      },
      {
        title: 'Metamorfosis',
        img:   '../images/logo1.png',
        desc:  'Logo ini merepresentasikan metamorfosis mahasiswa sebagai agen perubahan. Terinspirasi dari kupu-kupu, ia melambangkan proses, pertumbuhan, dan transformasi.'
      },
      {
        title: 'Struktur',
        img:   '../images/logo2.png',
        desc:  'Struktur bentuknya menyiratkan inisial "M", menegaskan bahwa perubahan tetap berakar pada jati diri.'
      },
      {
        title: 'Warna',
        img:   '../images/emas.png',
        desc:  'Warna kuning emas mencerminkan kehormatan, optimisme, serta identitas Universitas Mulawarman.'
      }
    ]);

    const visi = ref(
      'TRANSFORMASI BEM KM UNMUL YANG BERINTEGRITAS UNTUK TERUS BERKARYA ' +
      'SEBAGAI PENABUH GENDERANG PERLAWANAN DAN PERJUANGAN'
    );

    const misi = ref([
      {
        judul: 'KATALISATOR',
        deskripsi: 'GERAKAN MAHASISWA YANG LEBIH STRATEGIS, PARTISIPATIF, DAN INKLUSIF PADA ISU-ISU LINGKUNGAN, SOSIAL MASYARAKAT, POLITIK, HUKUM, KEAMANAN DAN HAK ASASI MANUSIA.'
      },
      {
        judul: 'INISIATOR',
        deskripsi: 'PENINGKATAN PARTISIPASI MINAT DAN BAKAT SERTA DAYA SAING MAHASISWA DEMI TERWUJUDNYA PRESTASI AKADEMIK DAN NON AKADEMIK MAHASISWA.'
      },
      {
        judul: 'KONTRIBUTOR',
        deskripsi: 'PELAYANAN ADVOKASI YANG EFEKTIF, RESPONSIF, DAN INOVATIF UNTUK MENINGKATKAN KESEJAHTERAAN DAN KEMAKMURAN MAHASISWA UNIVERSITAS MULAWARMAN.'
      },
      {
        judul: 'KOLABORATOR',
        deskripsi: 'PEMBANGUNAN RELASI YANG BERKELANJUTAN MELALUI SINERGI, KOORDINASI, DAN KOLABORASI DENGAN MITRA STRATEGIS SEHINGGA BERORIENTASI KEPADA KEMASLAHATAN.'
      },
      {
        judul: 'FASILITATOR',
        deskripsi: 'RUANG AMAN DAN NYAMAN LINGKUNGAN BAGI MAHASISWA SEBAGAI TEMPAT UNTUK SEPENUHNYA BEREKSPRESI DAN BERPENDAPAT SEBAGAI UPAYA PENINGKATAN DAYA KRITIS MAHASISWA.'
      },
      {
        judul: 'DINAMISATOR',
        deskripsi: 'PENATAAN BIROKRASI YANG TERTIB ADMINISTRASI SEBAGAI LEMBAGA YANG BERINTEGIRTAS, AKUNTABEL DAN TRANSPARAN.'
      }
    ]);

    /* ─────────────────────────────────────
       PHILOSOPHY: SCROLL TO ITEM
       Used by dot-navigation buttons
    ───────────────────────────────────── */
    const scrollToItem = (index) => {
      const el = philosophyItemRefs.value[index];
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    /* ─────────────────────────────────────
       INTERSECTION OBSERVER SETUP
       Strategy: find the item with highest
       intersectionRatio (most visible), with
       a 300ms throttle so rapid scroll doesn't
       spam image changes.
    ───────────────────────────────────── */
    let observer          = null;
    let resizeObserver    = null;
    let lastUpdateTime    = 0;
    const THROTTLE_MS     = 250;

    const buildObserverOptions = () => {
      const mobile = window.innerWidth <= 768;
      return {
        root:       null,
        rootMargin: mobile ? '0px 0px -20% 0px' : '0px 0px -38% 0px',
        threshold:  [0, 0.1, 0.25, 0.5, 0.75, 1.0]
      };
    };

    const onIntersection = (entries) => {
      const now = Date.now();
      if (now - lastUpdateTime < THROTTLE_MS) return;

      // Keep a running map: element → latest entry
      // (IntersectionObserver may batch multiple entries per frame)
      const latestMap = new Map();
      entries.forEach(e => latestMap.set(e.target, e));

      // From all currently-observed items, find the most-visible intersecting one
      const allItems = Array.from(document.querySelectorAll('.desc-item'));
      let bestIndex = -1;
      let bestRatio = -1;

      allItems.forEach((el, i) => {
        const entry = latestMap.get(el);
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestIndex = i;
        }
      });

      if (bestIndex === -1 || bestIndex === activeIndex.value) return;

      lastUpdateTime    = now;
      activeIndex.value = bestIndex;

      // Mobile: tiap card punya gambarnya sendiri di dalam HTML.
      // currentImg hanya dibutuhkan di desktop (sticky image column).
      // Jadi skip update currentImg jika layar ≤ 768px.
      const isDesktop = window.innerWidth > 768;
      if (isDesktop) {
        const newImg = filosofi.value[bestIndex]?.img;
        if (newImg && newImg !== currentImg.value) {
          // Simply update reactive ref — Vue <Transition> handles the crossfade animation
          currentImg.value = newImg;
        }
      }
    };

    const initObserver = () => {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(onIntersection, buildObserverOptions());
      nextTick(() => {
        document.querySelectorAll('.desc-item').forEach(el => observer.observe(el));
      });
    };

    /* ─────────────────────────────────────
       RESIZE HANDLER
       Rebuild observer on breakpoint change
       (rootMargin differs mobile vs desktop)
    ───────────────────────────────────── */
    let resizeTimeout = null;
    const onResize = () => {
      const nowMobile = window.innerWidth <= 768;
      if (nowMobile !== isMobileView.value) {
        isMobileView.value = nowMobile;
        // Debounce observer rebuild on resize
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initObserver, 300);
      }
    };

    /* ─────────────────────────────────────
       MOUNTED
    ───────────────────────────────────── */
    onMounted(() => {
      // Detect initial mobile state
      isMobileView.value = window.innerWidth <= 768;

      // Set initial image (no transition needed)
      const firstImg = filosofi.value[0]?.img;
      if (firstImg) currentImg.value = firstImg;

      // Start scroll observer after DOM ready
      nextTick(initObserver);

      // Passive resize listener (won't block scroll on 120Hz screens)
      window.addEventListener('resize', onResize, { passive: true });
    });

    /* ─────────────────────────────────────
       BEFORE UNMOUNT — cleanup
    ───────────────────────────────────── */
    onBeforeUnmount(() => {
      if (observer)       observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimeout);
    });

    /* ─────────────────────────────────────
       RETURN
    ───────────────────────────────────── */
    return {
      // from global
      ...global,

      // local reactive
      activeIndex,
      currentImg,
      isMobileView,
      philosophyItemRefs,

      // data
      aboutCards,
      filosofi,
      visi,
      misi,

      // methods
      scrollToItem
    };
  }
}).mount('#app');