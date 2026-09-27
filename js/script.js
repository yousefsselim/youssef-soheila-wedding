/* =========================================================
   WEDDING LANDING PAGE — SCRIPT
   Vanilla JavaScript only, no dependencies.
   ========================================================= */

/* =========================================================
   1. CONFIGURATION — edit everything here
   ========================================================= */
const weddingConfig = {
  groomName: "YOUSSEF",
  brideName: "SOHAILA",

  // Format: "YYYY-MM-DDTHH:MM:SS"
  weddingDate: "2026-11-23T19:00:00",

  venue: "CECILIA HALLS",
  address: "6483+MWQ، قومبانية أبو قير، مركز كفر الدوار، محافظة البحيرة 5921273",
  mapsUrl: "https://maps.app.goo.gl/2vYeYFqGMhADy7nr6", // paste your Google Maps link here

  // Phone / social links (used if you add contact elements later)
  phone: "+20 1278629469",
  social: {
    instagram: "#",
    facebook: "#"
  },

  // Path to your song file (also update the <source> tag in index.html)
  musicSrc: "audio/wedding-song.mp3",

  // Gallery images — replace src with your own photos.
  // Add or remove entries freely; the grid adapts automatically.
  gallery: [
    { src: "images/gallery-1.jpg", alt: "Youssef and Sohaila, moment one" },
    { src: "images/gallery-2.jpg", alt: "Youssef and Sohaila, moment two" },
    { src: "images/gallery-3.jpg", alt: "Youssef and Sohaila, moment three" },
    { src: "images/gallery-4.jpg", alt: "Youssef and Sohaila, moment four" },
    { src: "images/gallery-5.jpg", alt: "Youssef and Sohaila, moment five" },
    { src: "images/gallery-6.jpg", alt: "Youssef and Sohaila, moment six" }
  ]
};

/* =========================================================
   2. UTILITIES
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const pad2 = (n) => String(n).padStart(2, "0");

const formatDateReadable = (date) =>
  date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

const formatTimeReadable = (date) =>
  date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

/* =========================================================
   3. APPLY CONFIG TO THE PAGE (names, date, venue, maps)
   ========================================================= */
function applyConfig() {
  const weddingDate = new Date(weddingConfig.weddingDate);

  const heroDateValue = $("#heroDateValue");
  if (heroDateValue) heroDateValue.textContent = formatDateReadable(weddingDate);

  const venueName = $("#venueName");
  if (venueName) venueName.textContent = weddingConfig.venue;

  const venueAddress = $("#venueAddress");
  if (venueAddress) venueAddress.textContent = weddingConfig.address;

  const venueDate = $("#venueDate");
  if (venueDate) venueDate.textContent = formatDateReadable(weddingDate);

  const venueTime = $("#venueTime");
  if (venueTime) venueTime.textContent = formatTimeReadable(weddingDate);

  const venueMapLink = $("#venueMapLink");
  if (venueMapLink) venueMapLink.href = weddingConfig.mapsUrl;

  document.title = `${weddingConfig.groomName} & ${weddingConfig.brideName} | Our Wedding`;
}

/* =========================================================
   4. COUNTDOWN TIMER
   ========================================================= */
function initCountdown() {
  const weddingDate = new Date(weddingConfig.weddingDate).getTime();
  const grid = $("#countdownGrid");
  const doneMessage = $("#countdownDone");

  const els = {
    days: $("#cd-days"),
    hours: $("#cd-hours"),
    minutes: $("#cd-minutes"),
    seconds: $("#cd-seconds")
  };

  function tick() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
      if (grid) grid.hidden = true;
      if (doneMessage) doneMessage.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (els.days) els.days.textContent = pad2(days);
    if (els.hours) els.hours.textContent = pad2(hours);
    if (els.minutes) els.minutes.textContent = pad2(minutes);
    if (els.seconds) els.seconds.textContent = pad2(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* =========================================================
   5. SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
function initScrollReveal() {
  const items = $$(".reveal-item");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.setProperty("--reveal-delay", `${delay}ms`);
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* =========================================================
   6. NAVIGATION (mobile menu + smooth scroll + active link)
   ========================================================= */
function initNavigation() {
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".nav-link", links).forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll for any in-page anchor (native scroll-behavior handles most,
  // this ensures consistent behavior across older browsers)
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length > 1) {
        const target = $(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

/* =========================================================
   7. FLOATING HEART PARTICLES (hero background)
   ========================================================= */
function initHeroParticles() {
  const container = $("#heroParticles");
  if (!container) return;

  const symbols = ["♥", "❤"];
  const count = window.innerWidth < 600 ? 8 : 14;

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "hero-particle";
    span.textContent = symbols[i % symbols.length];
    span.style.left = `${Math.random() * 100}%`;
    span.style.setProperty("--drift", `${(Math.random() * 80 - 40).toFixed(0)}px`);
    span.style.fontSize = `${10 + Math.random() * 10}px`;
    span.style.animationDuration = `${10 + Math.random() * 10}s`;
    span.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(span);
  }
}

/* =========================================================
   8. GALLERY + LIGHTBOX
   ========================================================= */
function initGallery() {
  const grid = $("#galleryGrid");
  if (!grid) return;

  weddingConfig.gallery.forEach((photo, index) => {
    const figure = document.createElement("div");
    figure.className = "gallery-item reveal-item";
    figure.dataset.reveal = "scale";
    figure.dataset.delay = String((index % 3) * 80);
    figure.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || "Wedding photo";
    img.loading = "lazy";

    figure.appendChild(img);
    grid.appendChild(figure);
  });

  // Re-run reveal observation for dynamically added items
  initScrollReveal();

  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const closeBtn = $("#lightboxClose");
  const prevBtn = $("#lightboxPrev");
  const nextBtn = $("#lightboxNext");

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function updateLightboxImage() {
    const photo = weddingConfig.gallery[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt || "Wedding photo";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % weddingConfig.gallery.length;
    updateLightboxImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + weddingConfig.gallery.length) % weddingConfig.gallery.length;
    updateLightboxImage();
  }

  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightbox(Number(item.dataset.index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/* =========================================================
   9. RSVP FORM (client-side validation only, no backend)
   ========================================================= */
function initRsvpForm() {
  const form = $("#rsvpForm");
  if (!form) return;

  const successBox = $("#rsvpSuccess");
  const successMessage = $("#rsvpSuccessMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    const name = $("#rsvpName", form);
    const guests = $("#rsvpGuests", form);
    const attendanceInputs = $$('input[name="attendance"]', form);
    const attendanceGroup = $(".form-radio-group", form);

    const errName = $("#err-name");
    const errGuests = $("#err-guests");
    const errAttendance = $("#err-attendance");

    [name, guests].forEach((input) => input.classList.remove("is-invalid"));
    attendanceGroup.classList.remove("is-invalid");
    [errName, errGuests, errAttendance].forEach((el) => (el.textContent = ""));

    if (!name.value.trim()) {
      isValid = false;
      name.classList.add("is-invalid");
      errName.textContent = "Please enter your name.";
    }

    if (!guests.value || Number(guests.value) < 1) {
      isValid = false;
      guests.classList.add("is-invalid");
      errGuests.textContent = "Please enter at least 1 guest.";
    }

    const selectedAttendance = attendanceInputs.find((input) => input.checked);
    if (!selectedAttendance) {
      isValid = false;
      attendanceGroup.classList.add("is-invalid");
      errAttendance.textContent = "Please let us know if you can attend.";
    }

    if (!isValid) return;

    const isAttending = selectedAttendance.value === "yes";

    successMessage.textContent = isAttending
      ? `Thank you, ${name.value.trim()} — we can't wait to celebrate with you!`
      : `Thank you, ${name.value.trim()} — you'll be missed, but we appreciate you letting us know.`;

    form.hidden = true;
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* =========================================================
   10. MUSIC TOGGLE
   ========================================================= */

function initMusic() {
  const btn = $("#musicBtn");
  const audio = $("#weddingMusic");

  if (!btn || !audio) return;

  audio.volume = 0.5;
  audio.loop = true;

  // Update button state
  function setPlayingState(isPlaying) {
    if (isPlaying) {
      btn.classList.add("is-playing");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Pause wedding music");
    } else {
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play wedding music");
    }
  }

  // Try autoplay
  audio.play()
    .then(() => {
      setPlayingState(true);
    })
    .catch(() => {
      // Browser blocked autoplay.
      // Music will start after the first user interaction.
      setPlayingState(false);
    });

  // Start music after first interaction if autoplay was blocked
  const startMusic = () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          setPlayingState(true);
        })
        .catch(() => {});
    }
  };

  document.addEventListener("click", startMusic, { once: true });
  document.addEventListener("touchstart", startMusic, { once: true });

  // Manual Play / Pause button
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (audio.paused) {
      audio.play()
        .then(() => {
          setPlayingState(true);
        })
        .catch(() => {});
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  // Keep button state synchronized with audio
  audio.addEventListener("play", () => {
    setPlayingState(true);
  });

  audio.addEventListener("pause", () => {
    setPlayingState(false);
  });
}

/* =========================================================
   11. NAV BACKGROUND ON SCROLL (subtle elevation)
   ========================================================= */
function initNavScrollState() {
  const nav = $("#siteNav");
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = "0 10px 30px -20px rgba(43,38,34,0.35)";
    } else {
      nav.style.boxShadow = "none";
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initCountdown();
  initNavigation();
  initNavScrollState();
  initHeroParticles();
  initGallery();
  initRsvpForm();
  initMusic();
  initScrollReveal();
});
