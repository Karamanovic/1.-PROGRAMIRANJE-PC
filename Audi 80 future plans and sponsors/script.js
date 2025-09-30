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
  
  // Gallery images: expects assets/photos/photo1.png ... photo3.png
  const galleryImages = [
    "photo1.png",
    "photo2.png",
    "photo3.png",
  ];
  
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
  
  // Initialize
  setLanguage(currentLang);
  renderGallery();
  