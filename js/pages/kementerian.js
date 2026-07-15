const { createApp, ref } = Vue;

createApp({
  setup() {
    const global = sharedSetup();

    const daftarKementerian = ref([
      { name: "Kaderisasi & Pengembangan Sumber Daya Mahasiswa", img: "../images/kpsdm.png", link: "../pages/kementerian/detail-kpsdm.html" },
      { name: "Komunikasi & Informasi", img: "../images/kominfo.png", link: "../pages/kementerian/detail-kominfo.html" },
      { name: "Sosial Politik", img: "../images/sospol.png", link: "../pages/kementerian/detail-sospol.html" },
      { name: "Perlindungan & Pemberdayaan Perempuan", img: "../images/p3.png", link: "../pages/kementerian/detail-p3.html" },
      { name: "Minat Bakat", img: "../images/miba.png", link: "../pages/kementerian/detail-miba.html" },
      { name: "Kesenian & Kebudayaan", img: "../images/kesbud.png", link: "../pages/kementerian/detail-kesbud.html" },
      { name: "Sosial Masyarakat", img: "../images/sosmas.png", link: "../pages/kementerian/detail-sosmas.html" },
      { name: "Advokasi Kesejahteraan Mahasiswa", img: "../images/adkesma.png", link: "../pages/kementerian/detail-adkesma.html" },
      { name: "Penelitian, Riset & Kajian", img: "../images/prk.png", link: "../pages/kementerian/detail-prk.html" },
      { name: "Lingkungan Hidup & Kehutanan", img: "../images/lhk.png", link: "../pages/kementerian/detail-lhk.html" },
      { name: "Dalam Negeri", img: "../images/dagri.png", link: "../pages/kementerian/detail-dagri.html" },
      { name: "Luar Negeri", img: "../images/lugri.png", link: "../pages/kementerian/detail-lugri.html" },
      { name: "Kesehatan", img: "../images/kesehatan.png", link: "../pages/kementerian/detail-kesehatan.html" },
      { name: "Ekonomi Kreatif", img: "../images/ekraf.png", link: "../pages/kementerian/detail-ekraf.html" },
      { name: "Inspektorat", img: "../images/inspektorat.png", link: "../pages/kementerian/detail-inspektorat.html" }
    ]);

    const handleImageError = (e) => {
      e.target.src = '../images/emas.png';
    };

    return { 
      ...global, 
      daftarKementerian, 
      handleImageError 
    };
  }
}).mount('#app');