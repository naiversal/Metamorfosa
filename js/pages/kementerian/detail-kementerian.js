const { createApp, ref, onMounted, nextTick } = Vue;

createApp({
  setup() {
    const global = sharedSetup();
    const activeHighlight = ref(0);

    const filename = window.location.pathname.split('/').pop();
    let ministry = filename.replace('detail-', '').replace('.html', '');
    if (!ministry) ministry = 'dagri';
    document.body.setAttribute('data-ministry', ministry);

    const counts = {
      adkesma: 3,
      bpi: 4,
      dagri: 4,
      ekraf: 5,
      inspektorat: 4,
      kesbud: 4,
      kesehatan: 4,
      kominfo: 4,
      kpsdm: 4,
      lhk: 4,
      lugri: 4,
      miba: 5,
      p3: 6,
      prk: 4,
      sosmas: 4,
      sospol: 4,
      staffahli: 1
    };

    const highlightImgs = ref([]);
    const total = counts[ministry] || 3;
    highlightImgs.value.push({ src: `../../images/foto kementerian/${ministry}/Feeds.png`, alt: "Highlight 1" });
    for (let i = 1; i < total; i++) {
      highlightImgs.value.push({ src: `../../images/foto kementerian/${ministry}/Feeds-${i}.png`, alt: `Highlight ${i + 1}` });
    }

    function updateActiveHighlight() {
      const el = document.getElementById('highlightSlider');
      if (!el) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      const cards = el.querySelectorAll('.highlight-card');
      let closest = 0, minDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs((c.offsetLeft + c.clientWidth / 2) - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      activeHighlight.value = closest;
    }

    function slideHighlight(dir) {
      const el = document.getElementById('highlightSlider');
      if (el) el.scrollBy({ left: dir * 380, behavior: 'smooth' });
    }

    onMounted(() => {
      nextTick(() => {
        const hl = document.getElementById('highlightSlider');
        if (hl) {
          hl.addEventListener('scroll', updateActiveHighlight);
          setTimeout(updateActiveHighlight, 200);
        }
      });
    });

    return { ...global, activeHighlight, highlightImgs, updateActiveHighlight, slideHighlight };
  }
}).mount('#app');