// app.js - Script Principal da Área Pública (Integrado com Supabase / LocalStorage)

document.addEventListener("DOMContentLoaded", async () => {
  // Inicializa AOS (Animate on Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Inicializa Efeitos Especiais
  initMagicCursor();
  initParticles();
  initPetalsAndButterflies();
  
  // 1. Renderização Dinâmica imediata com dados locais para carregamento instantâneo
  renderDynamicContentLocal();

  // Inicializa Controle de Música
  await initMusicPlayer();

  // Inicializa Contadores
  await initCountdown();

  // 2. Inicialização em segundo plano do banco de dados (Supabase/Local)
  initDatabaseAsync();

  // Scroll Reveal Navbar Effect
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("main-navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });

  // Fecha o menu colapsável do mobile ao clicar em um link
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navbarCollapse = document.getElementById("navbarContent");
  if (navbarCollapse) {
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) {
          const toggler = document.querySelector(".navbar-toggler");
          if (toggler && !toggler.classList.contains("collapsed")) {
            toggler.click();
          }
        }
      });
    });
  }
  // Resetar telas de sucesso dos modals ao fechar
  const confirmGiftModal = document.getElementById("confirmGiftModal");
  if (confirmGiftModal) {
    confirmGiftModal.addEventListener("hidden.bs.modal", () => {
      const formWrap = document.getElementById("confirm-gift-form-wrapper");
      const successWrap = document.getElementById("confirm-gift-success-wrapper");
      if (formWrap) formWrap.classList.remove("d-none");
      if (successWrap) successWrap.classList.add("d-none");
    });
  }

  const pixDonationModal = document.getElementById("pixDonationModal");
  if (pixDonationModal) {
    pixDonationModal.addEventListener("hidden.bs.modal", () => {
      const formWrap = document.getElementById("pix-modal-form-wrapper");
      const successWrap = document.getElementById("pix-modal-success-wrapper");
      if (formWrap) formWrap.classList.remove("d-none");
      if (successWrap) successWrap.classList.add("d-none");
    });
  }
});

/* ==========================================================================
   1. CURSOR MÁGICO (TRAIL DE BRILHO)
   ========================================================================== */
function initMagicCursor() {
  const cursor = document.getElementById("magic-cursor");
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Suavização do movimento
  function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;

    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Efeitos ao passar por elementos clicáveis
  const clickables = document.querySelectorAll("a, button, .filter-btn, .gallery-item, .gift-card, .pix-val-card");
  clickables.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.8)";
      cursor.style.background = "radial-gradient(circle, var(--color-gold) 0%, rgba(183,110,121,0.9) 100%)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.background = "radial-gradient(circle, var(--color-rose-gold) 0%, rgba(212,175,55,0.7) 100%)";
    });
  });
}

/* ==========================================================================
   2. PARTÍCULAS DOURADAS (PARTICLES.JS)
   ========================================================================== */
function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 45,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": ["#D4AF37", "#B76E79", "#F8D7E8", "#F1E9D2"]
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.6,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 0.6,
          "opacity_min": 0.2,
          "sync": false
        }
      },
      "size": {
        "value": 4.5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false
      },
      "move": {
        "enable": true,
        "speed": 1.2,
        "direction": "top",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "bubble": {
          "distance": 150,
          "size": 6,
          "duration": 2,
          "opacity": 0.8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        }
      }
    },
    "retina_detect": true
  });
}

/* ==========================================================================
   3. ANIMAÇÕES DE PÉTALAS E BORBOLETAS
   ========================================================================== */
function initPetalsAndButterflies() {
  const container = document.getElementById("bg-garden-elements");
  if (!container) return;

  const maxPetals = window.innerWidth < 768 ? 12 : 25;
  for (let i = 0; i < maxPetals; i++) {
    createPetal(container);
  }

  setInterval(() => {
    createButterfly(container);
  }, 12000);
  
  setTimeout(() => createButterfly(container), 2000);
  setTimeout(() => createButterfly(container), 6000);
}

function createPetal(container) {
  const petal = document.createElement("div");
  petal.classList.add("petal");

  const size = Math.random() * 15 + 8;
  const left = Math.random() * window.innerWidth;
  const duration = Math.random() * 12 + 8;
  const delay = Math.random() * 10 * -1;

  petal.style.width = `${size}px`;
  petal.style.height = `${size * 0.8}px`;
  petal.style.left = `${left}px`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;

  container.appendChild(petal);

  petal.addEventListener("animationiteration", () => {
    petal.style.left = `${Math.random() * window.innerWidth}px`;
  });
}

function createButterfly(container) {
  const butterfly = document.createElement("div");
  butterfly.classList.add("butterfly");

  const startY = Math.random() * (window.innerHeight - 150) + 100;
  const sizeScale = Math.random() * 0.4 + 0.6;
  const duration = Math.random() * 10 + 18;

  butterfly.style.top = `${startY}px`;
  butterfly.style.animationDuration = `${duration}s`;
  butterfly.style.transform = `scale(${sizeScale})`;

  container.appendChild(butterfly);

  setTimeout(() => {
    butterfly.remove();
  }, duration * 1000);
}

/* ==========================================================================
   4. CONTAGEM REGRESSIVA (COUNTDOWN)
   ========================================================================== */
let countdownInterval;
async function initCountdown() {
  const db = await DB.get();
  const partyDate = new Date(db.config.partyDate).getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const diff = partyDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("hero-countdown").innerHTML = `<h3 class="font-celebration text-rose-gold fs-2">O grande dia chegou! Bem-vindos!</h3>`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");

    if (days < 30) {
      const boxes = document.querySelectorAll(".countdown-box");
      boxes.forEach(box => box.classList.add("countdown-near"));
    }
  }

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
}

/* ==========================================================================
   5. REPRODUTOR DE MÚSICA AMBIENTE
   ========================================================================== */
let isPlaying = false;
let currentTrackIndex = 0;

async function initMusicPlayer() {
  const audio = document.getElementById("bg-audio");
  const db = await DB.get();
  const tracks = db.config.musicTracks;

  if (!audio || !tracks || tracks.length === 0) return;

  const defaultTrackId = db.config.currentTrackId || "1";
  currentTrackIndex = tracks.findIndex(t => t.id === defaultTrackId);
  if (currentTrackIndex === -1) currentTrackIndex = 0;

  await loadTrack(currentTrackIndex);
}

async function loadTrack(index) {
  const audio = document.getElementById("bg-audio");
  const db = await DB.get();
  const track = db.config.musicTracks[index];

  if (!audio || !track) return;

  audio.src = track.url;
  document.getElementById("music-title").textContent = track.title;
  document.getElementById("music-artist").textContent = track.artist;
}

function toggleMusicPanel() {
  const player = document.getElementById("music-player-fixed");
  player.classList.toggle("expanded");
}

function toggleMusic() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  const audio = document.getElementById("bg-audio");
  const miniPlayIcon = document.querySelector("#music-mini-play i");
  const player = document.getElementById("music-player-fixed");

  if (!audio) return;

  audio.play()
    .then(() => {
      isPlaying = true;
      player.classList.add("playing");
      if (miniPlayIcon) {
        miniPlayIcon.className = "fa-solid fa-pause";
      }
    })
    .catch(e => {
      console.warn("Autoplay bloqueado pelo navegador.");
    });
}

function pauseMusic() {
  const audio = document.getElementById("bg-audio");
  const miniPlayIcon = document.querySelector("#music-mini-play i");
  const player = document.getElementById("music-player-fixed");

  if (!audio) return;

  audio.pause();
  isPlaying = false;
  player.classList.remove("playing");
  if (miniPlayIcon) {
    miniPlayIcon.className = "fa-solid fa-play";
  }
}

async function nextTrack() {
  const db = await DB.get();
  const tracks = db.config.musicTracks;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  await loadTrack(currentTrackIndex);
  if (isPlaying) {
    playMusic();
  }
}

async function prevTrack() {
  const db = await DB.get();
  const tracks = db.config.musicTracks;
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  await loadTrack(currentTrackIndex);
  if (isPlaying) {
    playMusic();
  }
}

window.toggleMusicPanel = toggleMusicPanel;
window.toggleMusic = toggleMusic;
window.nextTrack = nextTrack;
window.prevTrack = prevTrack;

/* ==========================================================================
   6. RENDERIZAÇÃO DE CONTEÚDO DINÂMICO
   ========================================================================== */
// Aplica um objeto de banco de dados (seja local ou do Supabase) no DOM
function applyDatabaseToDOM(db) {
  if (!db || !db.config) return;

  // Configurações Gerais
  document.getElementById("nav-brand-title").textContent = db.config.name.split(" ")[0];
  document.getElementById("hero-celebrant-name").textContent = db.config.name;
  document.getElementById("hero-celebration-quote").textContent = `"${db.config.quote}"`;

  const optDate = { day: 'numeric', month: 'long', year: 'numeric' };
  const dFesta = new Date(db.config.partyDate);
  document.getElementById("hero-celebration-date").textContent = dFesta.toLocaleDateString('pt-BR', optDate);

  // Hero Background
  const heroSection = document.getElementById("inicio");
  if (heroSection && db.config.heroImage) {
    heroSection.style.backgroundImage = `url('${db.config.heroImage}')`;
  }

  // Local
  if (db.config.location) {
    document.getElementById("local-address-display").textContent = db.config.location.address;
    document.getElementById("local-time-display").textContent = `A recepção terá início pontualmente às ${db.config.location.time}h.`;
    document.getElementById("local-parking-display").textContent = db.config.location.parking;
    document.getElementById("local-dress-display").textContent = db.config.location.dressCode;
    document.getElementById("local-map-iframe").src = db.config.location.mapUrl;
    document.getElementById("local-gmaps-link").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(db.config.location.address)}`;
  }

  if (db.timeline) renderTimeline(db.timeline);
  if (db.gallery) renderGallery(db.gallery);
  if (db.videos) renderVideos(db.videos);
  if (db.gifts) renderGifts(db.gifts);
  if (db.messages) renderMessages(db.messages);
  if (db.schedule) renderSchedule(db.schedule);
}

// Renderiza o conteúdo usando os valores locais padrão imediatamente
function renderDynamicContentLocal() {
  const localDefaults = window.DB && typeof window.DB.getDefaults === 'function' ? window.DB.getDefaults() : null;
  if (!localDefaults) return;
  
  // Clonar para evitar modificar o original diretamente se necessário
  const dbCopy = JSON.parse(JSON.stringify(localDefaults));
  
  // Garantir fotos locais mapeadas
  dbCopy.config.heroImage = "assets/IMG/fundo_hero_azul.jpeg";
  if (dbCopy.timeline) {
    dbCopy.timeline.forEach((item, index) => {
      if (index === 3) {
        item.image = "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg";
      } else {
        item.image = "";
      }
    });
  }
  
  const updatedGallery = [
    { id: "g1", title: "Caminho dos Sonhos", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (1).jpeg", featured: true },
    { id: "g2", title: "Sorriso Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg", featured: true },
    { id: "g3", title: "Momento com a Mãe 1", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47.jpeg" },
    { id: "g4", title: "Momento com a Mãe 2", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (1).jpeg" },
    { id: "g5", title: "Momento com a Mãe 3", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (2).jpeg" },
    { id: "g6", title: "Momento com a Mãe 4", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48.jpeg" },
    { id: "g7", title: "Ensaio Oficial 1", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48 (1).jpeg" },
    { id: "g8", title: "Ensaio Oficial 2", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49.jpeg" },
    { id: "g9", title: "Ensaio Oficial 3", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (1).jpeg" },
    { id: "g10", title: "Ensaio Oficial 4", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (2).jpeg" },
    { id: "g11", title: "Ensaio Oficial 5", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50.jpeg" },
    { id: "g12", title: "Ensaio Oficial 6", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (3).jpeg" },
    { id: "g13", title: "Ensaio Oficial 7", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.25.42.jpeg" }
  ];
  dbCopy.gallery = updatedGallery;
  dbCopy.config.gallery = updatedGallery;

  applyDatabaseToDOM(dbCopy);
}

// Inicializa conexão e sincronização com banco de dados em segundo plano
async function initDatabaseAsync() {
  try {
    // Inicializa a conexão com o Supabase
    await DB.init();
    
    // Carrega dados agregados (Supabase/LocalStorage)
    const db = await DB.get();
    
    // Atualiza o DOM com as customizações e dados mais recentes
    applyDatabaseToDOM(db);
    
    // Atualiza estatísticas RSVP
    await updateRSVPStats();
    
    // Atualiza AOS para recalcular posições corretas dos cards de animação
    setTimeout(() => {
      if (typeof AOS !== 'undefined') AOS.refresh();
    }, 500);
  } catch (err) {
    console.error("Erro ao carregar banco de dados assincronamente:", err);
  }
}

// Mantido para compatibilidade externa caso outros scripts chamem
async function renderDynamicContent() {
  const db = await DB.get();
  applyDatabaseToDOM(db);
}

function renderTimeline(timelineData) {
  const wrapper = document.getElementById("timeline-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  timelineData.forEach((item, index) => {
    const fadeDir = index % 2 === 0 ? "fade-right" : "fade-left";
    const timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item", "row");
    timelineItem.innerHTML = `
      <div class="col-12 timeline-col">
        <div class="timeline-dot"></div>
        <div class="timeline-content glass-panel p-4" data-aos="${fadeDir}">
          <span class="timeline-age">${item.age}</span>
          <h4 class="font-heading fs-5 fw-600 mt-1">${item.title}</h4>
          <p class="text-muted small mt-2">${item.description}</p>
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="timeline-img scale-hover">` : ""}
        </div>
      </div>
    `;
    wrapper.appendChild(timelineItem);
  });
}

let activeGalleryItems = [];
function renderGallery(galleryData) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = "";
  activeGalleryItems = galleryData;

  galleryData.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("gallery-item", "scale-hover");
    if (item.featured) {
      card.classList.add("featured");
    }
    card.setAttribute("data-category", item.category);
    card.setAttribute("onclick", `openLightbox(${index})`);
    
    const badgeHTML = item.featured ? `<div class="gallery-badge"><i class="fa-solid fa-star me-1"></i>Destaque</div>` : "";
    
    card.innerHTML = `
      ${badgeHTML}
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="gallery-overlay">
        <div class="gallery-info">
          <h5>${item.title}</h5>
          <span>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterGallery(category, btn) {
  const buttons = document.querySelectorAll("#gallery-filters-container .filter-btn");
  buttons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const items = document.querySelectorAll("#gallery-grid .gallery-item");
  items.forEach(item => {
    const itemCat = item.getAttribute("data-category");
    if (category === "todos" || itemCat === category) {
      item.style.display = "block";
      setTimeout(() => item.style.opacity = "1", 50);
    } else {
      item.style.opacity = "0";
      setTimeout(() => item.style.display = "none", 300);
    }
  });
}
window.filterGallery = filterGallery;

let currentLightboxIndex = 0;
function openLightbox(index) {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  
  if (!modal || !img || !activeGalleryItems[index]) return;

  currentLightboxIndex = index;
  img.src = activeGalleryItems[index].image;
  caption.innerHTML = `<h5>${activeGalleryItems[index].title}</h5><p class="text-uppercase font-monospace small" style="color: var(--color-gold); font-size: 0.75rem;">${activeGalleryItems[index].category}</p>`;
  
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  img.style.transform = "scale(0.9)";
  setTimeout(() => img.style.transform = "scale(1)", 50);
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

function changeLightboxImage(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + activeGalleryItems.length) % activeGalleryItems.length;
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  
  if (img) {
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = activeGalleryItems[currentLightboxIndex].image;
      caption.innerHTML = `<h5>${activeGalleryItems[currentLightboxIndex].title}</h5><p class="text-uppercase font-monospace small" style="color: var(--color-gold); font-size: 0.75rem;">${activeGalleryItems[currentLightboxIndex].category}</p>`;
      img.style.opacity = "1";
    }, 200);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") changeLightboxImage(-1);
  if (e.key === "ArrowRight") changeLightboxImage(1);
});
document.getElementById("lightbox-modal").addEventListener("click", (e) => {
  if (e.target.id === "lightbox-modal") closeLightbox();
});

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;

function renderVideos(videosData) {
  const wrapper = document.getElementById("video-wrapper");
  if (!wrapper || videosData.length === 0) return;

  const currentVideo = videosData[0];
  wrapper.innerHTML = `
    <div class="ratio ratio-video">
      <iframe src="${currentVideo.videoUrl}" title="${currentVideo.title}" allowfullscreen></iframe>
    </div>
  `;
}

function renderGifts(giftsData) {
  const grid = document.getElementById("gifts-grid");
  if (!grid) return;
  grid.innerHTML = "";

  giftsData.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("col-md-6", "col-lg-4");
    card.innerHTML = `
      <div class="glass-panel gift-card scale-hover ${item.chosen ? "chosen" : ""}" id="gift-card-${item.id}">
        <div class="gift-img-container">
          <img src="${item.image}" alt="${item.name}">
          <div class="gift-badge">R$ ${item.value.toFixed(2)}</div>
          <div class="gift-chosen-badge">
            <div class="text-center">
              <i class="fa-solid fa-gift fs-2 mb-2"></i>
              <div>Já Escolhido!</div>
              <small class="d-block mt-1 font-monospace" style="font-size:0.7rem;">Reservado por: ${item.chosenBy}</small>
            </div>
          </div>
        </div>
        <div class="gift-body text-center">
          <h4 class="gift-title">${item.name}</h4>
          <p class="gift-desc">${item.description}</p>
          <div class="gift-value">Valor: R$ ${item.value.toFixed(2)}</div>
          <button class="btn btn-rose w-100 mt-2" onclick="openGiftReservation('${item.id}', '${item.name}', '${item.description}', ${item.value})" ${item.chosen ? "disabled" : ""}>
            ${item.chosen ? "Já Presenteado" : '<i class="fa-solid fa-gift me-2"></i>Presentear'}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openGiftReservation(id, name, desc, val) {
  document.getElementById("gift-modal-item-id").value = id;
  document.getElementById("gift-modal-item-name").textContent = name;
  document.getElementById("gift-modal-item-desc").textContent = desc;
  document.getElementById("gift-modal-item-val").textContent = `R$ ${val.toFixed(2)}`;
  
  const modal = new bootstrap.Modal(document.getElementById("confirmGiftModal"));
  modal.show();
}
window.openGiftReservation = openGiftReservation;

async function handleChoosePhysicalGift(event) {
  event.preventDefault();
  const id = document.getElementById("gift-modal-item-id").value;
  const name = document.getElementById("gift-giver-name").value;

  if (!name.trim()) return;

  const db = await DB.get();
  const gift = db.gifts.find(g => g.id === id);
  
  if (gift) {
    gift.chosen = true;
    gift.chosenBy = name;
    
    await DB.saveGift(gift);

    // Mostrar a tela de sucesso dentro do modal
    document.getElementById("confirm-gift-form-wrapper").classList.add("d-none");
    document.getElementById("confirm-gift-success-wrapper").classList.remove("d-none");

    const msg = encodeURIComponent(`Olá! Acabei de escolher o presente "${gift.name}" (R$ ${gift.value.toFixed(2)}) para a Lavinia. Segue meu comprovante de transferência! (Assinado: ${name})`);
    const whatsappUrl = `https://wa.me/5521999999999?text=${msg}`;
    document.getElementById("confirm-gift-whatsapp-btn").href = whatsappUrl;

    document.getElementById("physical-gift-form").reset();

    // Atualiza listagem de presentes após gravação
    const updatedDb = await DB.get();
    renderGifts(updatedDb.gifts);
  }
}
window.handleChoosePhysicalGift = handleChoosePhysicalGift;

let selectedPixAmount = 100;
async function selectPixValue(amount, element) {
  const cards = document.querySelectorAll(".pix-val-card");
  cards.forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
  
  const customContainer = document.getElementById("custom-pix-amount-container");
  const customInput = document.getElementById("custom-pix-amount");

  if (amount === 'custom') {
    // Mostrar campo customizado
    customContainer.classList.remove("d-none");
    if (customInput.value) {
      selectedPixAmount = parseFloat(customInput.value) || 0;
    } else {
      selectedPixAmount = 0;
    }
    updateCustomPixQrCode();
  } else {
    // Esconder campo customizado e limpar
    customContainer.classList.add("d-none");
    selectedPixAmount = amount;
    
    const db = await DB.get();
    const qrcode = document.getElementById("pix-qrcode-img");
    const pixData = `00020101021126580014br.gov.bcb.pix0119${db.config.pixKey}5204000053039865405${amount.toFixed(2)}5802BR5925LAVINIA%20DOS%20SANTOS%20MATTOS6009SAO%20PAULO62070503***63041A2D`;
    qrcode.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixData)}`;
  }
}

async function updateCustomPixQrCode() {
  const customInput = document.getElementById("custom-pix-amount");
  const amount = parseFloat(customInput.value) || 0;
  selectedPixAmount = amount;

  const qrcode = document.getElementById("pix-qrcode-img");
  
  if (amount > 0) {
    const db = await DB.get();
    const pixData = `00020101021126580014br.gov.bcb.pix0119${db.config.pixKey}5204000053039865405${amount.toFixed(2)}5802BR5925LAVINIA%20DOS%20SANTOS%20MATTOS6009SAO%20PAULO62070503***63041A2D`;
    qrcode.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixData)}`;
  } else {
    // QR Code em branco se não tiver valor digitado ainda
    qrcode.src = "";
  }
}

function openPixModal(amount) {
  // 1. Mostrar o modal
  const modalEl = document.getElementById("pixDonationModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  // 2. Selecionar o card correto dentro do modal
  setTimeout(() => {
    let cardElement;
    if (amount === 'custom') {
      cardElement = document.querySelector(".pix-options-grid .pix-val-card[onclick*='custom']");
    } else {
      cardElement = document.querySelector(`.pix-options-grid .pix-val-card[onclick*='(${amount},']`);
    }
    
    if (cardElement) {
      selectPixValue(amount, cardElement);
    }
  }, 300);
}

window.selectPixValue = selectPixValue;
window.updateCustomPixQrCode = updateCustomPixQrCode;
window.openPixModal = openPixModal;

function copyPixKey() {
  const keyText = document.getElementById("pix-key-display").textContent;
  navigator.clipboard.writeText(keyText).then(() => {
    const successMsg = document.getElementById("copy-success-msg");
    successMsg.classList.remove("d-none");
    setTimeout(() => successMsg.classList.add("d-none"), 3000);
  });
}
window.copyPixKey = copyPixKey;

async function handlePixContribution(event) {
  event.preventDefault();
  const donorName = document.getElementById("pix-donor-name").value;
  if (!donorName.trim()) return;

  const newRsvp = {
    id: "r_pix_" + Date.now(),
    name: donorName + " (Pix Presente R$" + selectedPixAmount + ")",
    phone: "--",
    email: "--",
    adultsCount: 0,
    kidsCount: 0,
    companionNames: "",
    dietaryRestrictions: "",
    message: `Contribuiu com um Pix de R$ ${selectedPixAmount} para Lavinia.`,
    dateConfirmed: new Date().toISOString()
  };
  
  await DB.saveRsvp(newRsvp);

  // Mostrar a tela de sucesso dentro do modal
  document.getElementById("pix-modal-form-wrapper").classList.add("d-none");
  document.getElementById("pix-modal-success-wrapper").classList.remove("d-none");

  const formattedAmount = selectedPixAmount > 0 ? `R$ ${selectedPixAmount.toFixed(2)}` : "um valor livre";
  const msg = encodeURIComponent(`Olá! Acabei de enviar um presente em Pix de ${formattedAmount} para a Lavinia. Segue meu comprovante de transferência! (Assinado: ${donorName})`);
  const whatsappUrl = `https://wa.me/5521999999999?text=${msg}`;
  document.getElementById("pix-modal-whatsapp-btn").href = whatsappUrl;

  document.getElementById("pix-confirm-form").reset();
  
  await updateRSVPStats();
}
window.handlePixContribution = handlePixContribution;

function renderMessages(messagesData) {
  const wrapper = document.getElementById("messages-list-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  const approvedMsgs = messagesData.filter(m => m.approved);

  if (approvedMsgs.length === 0) {
    wrapper.innerHTML = `<div class="text-center text-muted py-5"><i class="fa-solid fa-feather fs-3 mb-2"></i><p>Seja o primeiro a deixar uma mensagem de carinho!</p></div>`;
    return;
  }

  approvedMsgs.sort((a, b) => new Date(b.date) - new Date(a.date));

  approvedMsgs.forEach(msg => {
    const card = document.createElement("div");
    card.classList.add("card", "glass-panel", "message-card");
    const formattedDate = new Date(msg.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    card.innerHTML = `
      <div class="card-body message-card-body">
        <h5 class="message-author">${msg.author}</h5>
        <div class="message-relation">${msg.relation}</div>
        <p class="message-text">"${msg.text}"</p>
        <div class="message-date">${formattedDate}</div>
      </div>
    `;
    wrapper.appendChild(card);
  });
}

async function submitMessage(event) {
  event.preventDefault();
  const author = document.getElementById("msg-author").value;
  const relation = document.getElementById("msg-relation").value;
  const text = document.getElementById("msg-text").value;

  if (!author.trim() || !relation.trim() || !text.trim()) return;

  const newMsg = {
    id: "m_" + Date.now(),
    author: author,
    relation: relation,
    text: text,
    date: new Date().toISOString(),
    approved: false // Necessita aprovação do moderador
  };

  await DB.saveMessage(newMsg);

  const successAlert = document.getElementById("msg-success-alert");
  successAlert.classList.remove("d-none");
  document.getElementById("msg-guestbook-form").reset();
  
  setTimeout(() => {
    successAlert.classList.add("d-none");
  }, 6000);
}
window.submitMessage = submitMessage;

function renderSchedule(scheduleData) {
  const wrapper = document.getElementById("schedule-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  scheduleData.forEach(item => {
    const cronItem = document.createElement("div");
    cronItem.classList.add("cron-item");
    cronItem.innerHTML = `
      <div class="cron-icon-box"><i class="fa-solid ${item.icon}"></i></div>
      <div class="cron-info-wrapper">
        <div class="cron-time">${item.time}</div>
        <div class="cron-title">${item.title}</div>
        ${item.description ? `<div class="cron-desc text-muted mt-1 small" style="font-size: 0.85rem; line-height: 1.4;">${item.description}</div>` : ""}
      </div>
    `;
    wrapper.appendChild(cronItem);
  });
}

/* ==========================================================================
   7. RSVP (CONFIRMAÇÃO DE PRESENÇA)
   ========================================================================== */
function toggleCompanionInput() {
  const adults = parseInt(document.getElementById("rsvp-adults").value);
  const kids = parseInt(document.getElementById("rsvp-kids").value);
  const wrapper = document.getElementById("companion-names-wrapper");

  if (adults > 0 || kids > 0) {
    wrapper.classList.remove("d-none");
    document.getElementById("rsvp-companion-names").required = true;
  } else {
    wrapper.classList.add("d-none");
    document.getElementById("rsvp-companion-names").required = false;
    document.getElementById("rsvp-companion-names").value = "";
  }
}
window.toggleCompanionInput = toggleCompanionInput;

async function updateRSVPStats() {
  const db = await DB.get();
  
  let totalAdults = 0;
  let totalKids = 0;

  db.rsvps.forEach(rsvp => {
    totalAdults += 1 + parseInt(rsvp.adultsCount || 0);
    totalKids += parseInt(rsvp.kidsCount || 0);
  });

  const grandTotal = totalAdults + totalKids;

  const statsTotal = document.getElementById("stats-total");
  const statsAdults = document.getElementById("stats-adults");
  const statsKids = document.getElementById("stats-kids");

  if (statsTotal) statsTotal.textContent = grandTotal;
  if (statsAdults) statsAdults.textContent = totalAdults;
  if (statsKids) statsKids.textContent = totalKids;
}

async function submitRSVP(event) {
  event.preventDefault();
  
  const name = document.getElementById("rsvp-name").value;
  const phone = document.getElementById("rsvp-phone").value;
  const email = document.getElementById("rsvp-email").value;
  const adults = parseInt(document.getElementById("rsvp-rsvp-adults")?.value || document.getElementById("rsvp-adults").value);
  const kids = parseInt(document.getElementById("rsvp-rsvp-kids")?.value || document.getElementById("rsvp-kids").value);
  const companions = document.getElementById("rsvp-companion-names").value;
  const diet = document.getElementById("rsvp-diet").value;
  const message = document.getElementById("rsvp-message").value;

  if (!name.trim() || !phone.trim() || !email.trim()) return;

  const newRsvp = {
    id: "r_" + Date.now(),
    name: name,
    phone: phone,
    email: email,
    adultsCount: adults,
    kidsCount: kids,
    companionNames: companions,
    dietaryRestrictions: diet || "Sem restrições",
    message: message,
    dateConfirmed: new Date().toISOString()
  };

  await DB.saveRsvp(newRsvp);
  
  if (message.trim()) {
    await DB.saveMessage({
      id: "m_rsvp_" + Date.now(),
      author: name,
      relation: "Convidado",
      text: message,
      date: new Date().toISOString(),
      approved: false
    });
  }

  document.getElementById("rsvp-form").classList.add("d-none");
  document.getElementById("rsvp-success-alert").classList.remove("d-none");
  document.getElementById("rsvp").scrollIntoView({ behavior: "smooth" });

  await updateRSVPStats();
  
  // Re-render mensagens
  const updatedDb = await DB.get();
  renderMessages(updatedDb.messages);
}
window.submitRSVP = submitRSVP;

/* ==========================================================================
   8. ACESSIBILIDADE (FONTE E CONTRASTE)
   ========================================================================== */
let fontSizeMultiplier = 1.0;
function changeFontSize(action) {
  const root = document.documentElement;
  
  if (action === "increase") {
    if (fontSizeMultiplier < 1.3) fontSizeMultiplier += 0.05;
  } else if (action === "decrease") {
    if (fontSizeMultiplier > 0.85) fontSizeMultiplier -= 0.05;
  } else {
    fontSizeMultiplier = 1.0;
  }

  root.style.fontSize = `${fontSizeMultiplier * 100}%`;
}
window.changeFontSize = changeFontSize;

function toggleHighContrast() {
  document.body.classList.toggle("high-contrast");
  const isHigh = document.body.classList.contains("high-contrast");
  localStorage.setItem("high-contrast-active", isHigh ? "true" : "false");
}
window.toggleHighContrast = toggleHighContrast;

if (localStorage.getItem("high-contrast-active") === "true") {
  document.body.classList.add("high-contrast");
}

/* ==========================================================================
   9. ENVIO DE FOTO DO CONVIDADO (CLIENT-SIDE COMPRESSION & UPLOAD)
   ========================================================================== */
async function handleGuestPhotoUpload(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById("up-name");
  const fileInput = document.getElementById("up-file");
  const submitBtn = document.getElementById("btn-upload-photo-submit");
  
  if (!nameInput || !fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Por favor, preencha o nome e selecione uma foto.");
    return;
  }
  
  const file = fileInput.files[0];
  const name = nameInput.value.trim();
  
  // Alterar botão para carregando
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...`;
  
  // Comprimir imagem no client-side
  compressImage(file, 800, 800, 0.7, async (dataUrl) => {
    const galleryItem = {
      id: "upload_" + Date.now(),
      title: name,
      category: "convidados",
      image: dataUrl
    };
    
    try {
      const success = await DB.saveGalleryItem(galleryItem);
      if (success) {
        alert("Sua foto foi enviada com sucesso! Ela já está aparecendo na aba 'Convidados'.");
        
        // Limpar formulário e fechar modal
        nameInput.value = "";
        fileInput.value = "";
        
        const modalEl = document.getElementById("uploadPhotoModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        
        // Recarregar a galeria dinamicamente
        const db = await DB.get();
        renderGallery(db.gallery);
      } else {
        alert("Erro ao enviar a foto. Tente novamente.");
      }
    } catch (e) {
      console.error("Erro ao enviar imagem:", e);
      alert("Erro ao processar imagem.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up me-2"></i>Enviar Foto`;
    }
  });
}

function compressImage(file, maxWidth, maxHeight, quality, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      callback(dataUrl);
    };
  };
}

// Tornar disponível globalmente
window.handleGuestPhotoUpload = handleGuestPhotoUpload;

// Recalcular posições dos elementos para animação de scroll (AOS) quando todas as fotos carregarem
window.addEventListener("load", () => {
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
});

