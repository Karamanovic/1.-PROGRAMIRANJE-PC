const translations = {
    sr: {
      heroTitle: "KARAS ENTERPRISE — Audi 80 B3 1.8 Turbo",
      heroSub: "OEM+ stanced daily driver. Tražimo sponzora: LOBA.",
      storyTitle: "Priča projekta",
      storyText: "Vlasnik ima emotivnu vezu 4+ godine sa ovim Audi 80. Vozilo je solidna baza sa OEM+ stanced vizijom.",
      specsTitle: "Trenutni podaci",
      goalsTitle: "Ciljevi projekta",
      galleryTitle: "Galerija",
      contactTitle: "Kontakt / Dogovor za pregled",
      contactButton: "Pošalji pitch LOBA-i"
    },
    en: {
      heroTitle: "KARAS ENTERPRISE — Audi 80 B3 1.8 Turbo",
      heroSub: "OEM+ stanced daily driver. Seeking sponsor: LOBA.",
      storyTitle: "Project story",
      storyText: "Owner has an emotional 4+ year bond with this Audi 80. The car is a solid base with an OEM+ stanced vision.",
      specsTitle: "Current specs",
      goalsTitle: "Project goals",
      galleryTitle: "Gallery",
      contactTitle: "Contact / Book a viewing",
      contactButton: "Send pitch to LOBA"
    }
  };
  
// Show/hide the arrow-up button based on scroll position
window.addEventListener('scroll', function () {
  const arrowUp = document.getElementById('arrow-up');
  if (window.scrollY > 100) {
    arrowUp.classList.add('show'); // Add class to make it visible
  } else {
    arrowUp.classList.remove('show'); // Remove class to hide it
  }
});

// Scroll to top on click
document.getElementById('arrow-up').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

  let currentLang = "sr";
  
  function setLanguage(lang){
    currentLang = lang;
    document.documentElement.lang = (lang==="sr")?"sr":"en";
    document.getElementById("hero-title").textContent = translations[lang].heroTitle;
    document.getElementById("hero-sub").textContent = translations[lang].heroSub;
    document.querySelectorAll("[data-en]").forEach(el=>{
      const key = el.getAttribute("data-en");
      // data attributes contain both sr/en versions already in HTML; replace with the selected one
      el.textContent = el.getAttribute("data-"+(lang==="sr"?"sr":"en"));
    });
  }
  
  document.getElementById("lang-toggle").addEventListener("click", ()=>{
    setLanguage(currentLang==="sr"?"en":"sr");
  });
  
 
  
  function renderGallery(){
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = ""; // clear
    galleryImages.forEach(src=>{
      const wrapper = document.createElement("div");
      wrapper.className = "gallery-item";
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Audi 80 project image";
      img.tabIndex = 0;
      img.addEventListener("click", ()=> openLightbox(src));
      img.addEventListener("keypress", (e)=>{ if(e.key==='Enter') openLightbox(src); });
      wrapper.appendChild(img);
      grid.appendChild(wrapper);
    });
  }
  
  function openLightbox(src){
    const overlay = document.createElement("div");
    overlay.style.position="fixed";
    overlay.style.top=0; overlay.style.left=0; overlay.style.right=0; overlay.style.bottom=0;
    overlay.style.background="rgba(0,0,0,0.9)";
    overlay.style.display="flex"; overlay.style.alignItems="center"; overlay.style.justifyContent="center";
    overlay.style.zIndex=9999;
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth="92%";
    img.style.maxHeight="92%";
    img.alt = "Large view";
    overlay.appendChild(img);
    overlay.addEventListener("click", ()=> document.body.removeChild(overlay));
    overlay.addEventListener("keydown", (e)=> { if(e.key==='Escape') { if(document.body.contains(overlay)) document.body.removeChild(overlay); }});
    document.body.appendChild(overlay);
    img.focus();
  }
  
  // Contact button: pre-filled pitch email to LOBA (we open mailto so user can review)
  document.getElementById("email-loba").addEventListener("click", ()=>{
    const subject = encodeURIComponent("LOBA — predlažem ti Audi 80 koji vrijedi srediti | KARAS ENTERPRISE");
    const body = encodeURIComponent(
  `Zdravo Loba,
  
  Ja sam Dejan (KARAS ENTERPRISE). Imam Audi 80 B3 1.8 turbo (≈300.000 km) — OEM+ stanced koncept. Imam fotosadržaj i pitch spreman.
  
  Link do prezentacije/pitcha: [URL PLACEHOLDER]
  
  Ako te zanima, mogu dogovoriti termin za pregled.
  
  Pozdrav,
  Dejan (@karasenterprise)
  +38766483936`
    );
    // Replace with LOBA's preferred contact if known; this opens user's mail client.
    window.location.href = `mailto:lobanjica853@gmail.com?subject=${subject}&body=${body}`;
  });

  document.getElementById("lang-toggle-nav").addEventListener("click", () => {
    setLanguage(currentLang === "sr" ? "en" : "sr");
  });

  // Simple lightbox for current-state images
document.querySelectorAll('.state-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 2000;

    const large = document.createElement('img');
    large.src = img.src;
    large.alt = img.alt || '';
    large.style.maxWidth = '92%';
    large.style.maxHeight = '92%';
    large.style.boxShadow = '0 10px 40px rgba(0,0,0,0.8)';
    large.style.borderRadius = '8px';

    overlay.appendChild(large);
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    document.body.appendChild(overlay);
    // allow Esc to close
    function onKey(e) {
      if (e.key === 'Escape') {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        document.removeEventListener('keydown', onKey);
      }
    }
    document.addEventListener('keydown', onKey);
  });
});

/* Trenutno stanje - slike KLIK DA UVECAS */

// Robust delegated lightbox for .current-gallery
(function () {
  // Helper: close lightbox
  function closeLightbox(overlay, keyHandler) {
    if (!overlay) return;
    document.removeEventListener('keydown', keyHandler);
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  // Key handler creator so we can remove it later
  function makeKeyHandler(overlay) {
    return function (e) {
      if (e.key === 'Escape') closeLightbox(overlay, makeKeyHandler);
    };
  }

  // Single delegated click listener on document
  document.addEventListener('click', function (ev) {
    const t = ev.target;

    // Find if click was on an <img> inside .current-gallery (works even for dynamically added images)
    if (t && t.tagName === 'IMG' && t.closest && t.closest('.current-gallery')) {
      ev.preventDefault();

      // Prevent opening multiple overlays
      if (document.querySelector('.simple-lightbox-overlay')) return;

      // Build overlay
      const overlay = document.createElement('div');
      overlay.className = 'simple-lightbox-overlay';

      const large = document.createElement('img');
      large.className = 'simple-lightbox-img';
      // Use dataset-large if you have higher-res source, else use src
      large.src = t.dataset.large || t.src;
      large.alt = t.alt || '';

      // Optional caption from <figcaption> or alt
      let captionText = t.alt || '';
      const fig = t.closest('figure');
      if (fig) {
        const cap = fig.querySelector('figcaption');
        if (cap && cap.textContent.trim()) captionText = cap.textContent.trim();
      }
      const caption = document.createElement('div');
      caption.className = 'simple-lightbox-caption';
      caption.textContent = captionText;

      // Append elements
      overlay.appendChild(large);
      if (captionText) overlay.appendChild(caption);
      document.body.appendChild(overlay);

      // Lock scrolling
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // Close on click outside image
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeLightbox(overlay);
      });

      // Close on Escape
      const keyHandler = function (e) { if (e.key === 'Escape') closeLightbox(overlay); };
      document.addEventListener('keydown', keyHandler);
    }
  });
})();
  
  // Initialize
  setLanguage(currentLang);
  renderGallery();
  