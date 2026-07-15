const sharedSetup = () => {
  const { ref, onMounted, nextTick } = Vue;

  const progress = ref(0);
  const isLoaded = ref(false);
  const isNavShrunk = ref(false);
  const isMobileMenuOpen = ref(false);

  onMounted(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({ once: false, mirror: true, duration: 900, easing: 'ease-out-cubic', offset: 100 });
    }

    const interval = setInterval(() => {
      progress.value += Math.floor(Math.random() * 5 + 2);
      if (progress.value >= 100) {
        progress.value = 100;
        clearInterval(interval);
        setTimeout(() => {
          isLoaded.value = true;
          const splashEl = document.getElementById("splash");
          if (splashEl) splashEl.classList.add("hide-splash");
          
          nextTick(() => {
            if (typeof AOS !== 'undefined') AOS.refreshHard();
          });
        }, 400);
      }
    }, 50);

    window.addEventListener('scroll', () => {
      isNavShrunk.value = window.scrollY > 40;
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) isMobileMenuOpen.value = false;
    });
  });

  return { progress, isLoaded, isNavShrunk, isMobileMenuOpen };
};