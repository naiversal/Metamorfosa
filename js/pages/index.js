const { createApp, onMounted } = Vue;

createApp({
  setup() {
    const global = sharedSetup();

    onMounted(() => {
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.addEventListener("click", () => {
          item.classList.toggle("active");
        });
      });

      const grid = document.querySelector(".cards-grid");
      const dotsContainer = document.getElementById("cardsDots");
      const cards = document.querySelectorAll(".cards-grid .card");

      if (grid && dotsContainer && cards.length) {
        cards.forEach((_, i) => {
          const dot = document.createElement("div");
          dot.className = "cards-dot" + (i === 0 ? " active" : "");
          dot.addEventListener("click", () => {
            cards[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          });
          dotsContainer.appendChild(dot);
        });

        function updateActive() {
          const scrollLeft = grid.scrollLeft;
          const center = scrollLeft + grid.clientWidth / 2;
          let closest = 0, minDist = Infinity;
          cards.forEach((c, i) => {
            const dist = Math.abs((c.offsetLeft + c.offsetWidth / 2) - center);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          cards.forEach((c, i) => c.classList.toggle("active", i === closest));
          dotsContainer.querySelectorAll(".cards-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === closest);
          });
        }

        grid.addEventListener("scroll", updateActive, { passive: true });
        setTimeout(updateActive, 100);
      }
    });

    return { ...global };
  }
}).mount('#app');