const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px 6% 0px', threshold: 0.01 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const mouseCursor = document.querySelector('.mouse-cursor');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Apri il menu' : 'Chiudi il menu');
  nav.classList.toggle('open', !isOpen);
  header.classList.toggle('menu-open', !isOpen);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Apri il menu');
  nav.classList.remove('open');
  header.classList.remove('menu-open');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const aura = document.querySelector('.pointer-aura');
if (aura && window.matchMedia('(pointer: fine)').matches) {
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let frameRequested = false;
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(() => {
        aura.style.left = `${pointerX}px`;
        aura.style.top = `${pointerY}px`;
        aura.classList.add('visible');
        frameRequested = false;
      });
    }
  }, { passive: true });
  document.querySelectorAll('a, button, .service-item, .work-card').forEach((target) => {
    target.addEventListener('pointerenter', () => aura.classList.add('is-hot'));
    target.addEventListener('pointerleave', () => aura.classList.remove('is-hot'));
  });
  document.addEventListener('pointerleave', () => aura.classList.remove('visible'));
}


const heroGlow = document.querySelector('.hero-glow');
const progressBar = document.querySelector('.page-progress span');
const scrollSwitch = document.querySelector('.scroll-switch');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 40);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

if (scrollSwitch) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    const atHero = entry.isIntersecting && entry.intersectionRatio > 0.42;
    scrollSwitch.href = atHero ? '#studio' : '#home';
    scrollSwitch.setAttribute('aria-label', atHero ? 'Scorri verso il basso' : 'Torna all’inizio');
    scrollSwitch.querySelector('.scroll-switch-label').textContent = atHero ? 'SCOPRI IL RACCONTO' : 'TORNA ALL’INIZIO';
    scrollSwitch.querySelector('.scroll-switch-icon').textContent = atHero ? '↓' : '↑';
    scrollSwitch.classList.toggle('scroll-up', !atHero);
  }, { threshold: [0, 0.42, 0.6] });
  heroObserver.observe(document.querySelector('.hero'));
  const filmScene = document.querySelector('.film-scroll');
  if (filmScene && mouseCursor && window.matchMedia('(pointer: fine)').matches) {
    filmScene.querySelectorAll('.film-stage, .mobile-film-media').forEach((media) => {
      media.addEventListener('pointerenter', () => mouseCursor.classList.add('on-video'));
      media.addEventListener('pointerleave', () => mouseCursor.classList.remove('on-video'));
    });
  }
}

if (mouseCursor && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    mouseCursor.style.left = `${event.clientX}px`;
    mouseCursor.style.top = `${event.clientY}px`;
    mouseCursor.classList.add('cursor-visible');
    const underPointer = document.elementFromPoint(event.clientX, event.clientY);
      const lightSurface = underPointer?.closest('.manifesto, .process, .work, .instagram-preview');
    mouseCursor.classList.toggle('on-light', Boolean(lightSurface));
  }, { passive: true });
  document.addEventListener('pointerleave', () => mouseCursor.classList.remove('cursor-visible'));
  document.querySelectorAll('a, button, h1, h2, h3, .service-item').forEach((target) => {
    target.addEventListener('pointerenter', () => mouseCursor.classList.add('cursor-hover'));
    target.addEventListener('pointerleave', () => mouseCursor.classList.remove('cursor-hover'));
  });
  document.querySelectorAll('.ig-tile').forEach((tile) => {
    tile.addEventListener('pointerenter', () => mouseCursor.classList.add('on-video'));
    tile.addEventListener('pointerleave', () => mouseCursor.classList.remove('on-video'));
  });
}

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.hero h1, .section h2, .story-copy h2, .process-text h3, .service-item h3, .work-statement p, .contact h2, .text-link').forEach((text) => {
    text.addEventListener('pointerenter', () => text.classList.add('cursor-focus'));
    text.addEventListener('pointerleave', () => text.classList.remove('cursor-focus'));
  });
}

const touchTrail = document.querySelector('.touch-trail');
if (touchTrail && window.matchMedia('(pointer: coarse)').matches) {
  let lastPoint = null;
  let lastStamp = 0;
  const marks = [];
  function leaveTrail(point) {
    const now = performance.now();
    const previous = lastPoint;
    if (lastPoint) {
      const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
      if (distance < 10 && now - lastStamp < 24) return;
    }
    lastPoint = point;
    lastStamp = now;

    const mark = document.createElement('span');
    mark.className = 'touch-trail-mark';
    mark.style.left = `${point.x}px`;
    mark.style.top = `${point.y}px`;
    const angle = previous ? Math.atan2(point.y - previous.y, point.x - previous.x) : 0;
    mark.style.setProperty('--trail-angle', `${angle}rad`);
    touchTrail.append(mark);
    marks.push(mark);
    if (marks.length > 26) marks.shift().remove();
    window.setTimeout(() => {
      mark.remove();
      const index = marks.indexOf(mark);
      if (index !== -1) marks.splice(index, 1);
    }, 1050);
  }
  if ('ontouchmove' in window) {
    window.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (touch) lastPoint = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    window.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (touch) leaveTrail({ x: touch.clientX, y: touch.clientY });
    }, { passive: true });
    window.addEventListener('touchend', () => { lastPoint = null; }, { passive: true });
    window.addEventListener('touchcancel', () => { lastPoint = null; }, { passive: true });
  } else {
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') leaveTrail({ x: event.clientX, y: event.clientY });
    }, { passive: true });
    window.addEventListener('pointerup', () => { lastPoint = null; }, { passive: true });
    window.addEventListener('pointercancel', () => { lastPoint = null; }, { passive: true });
  }
}

if (heroGlow && window.matchMedia('(pointer: fine)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroGlow.style.transform = `translate(calc(-50% + ${x * 28}px), calc(-50% + ${y * 24}px))`;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { heroGlow.style.transform = 'translate(-50%, -50%)'; });
}


const storyFrame = document.querySelector('.story-frame');
const storySection = document.querySelector('.story');
if (storyFrame && storySection && window.matchMedia('(pointer: fine)').matches) {
  storySection.addEventListener('pointermove', (event) => {
    const rect = storySection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    storyFrame.style.transform = `translate(${x * 12}px, ${y * 12}px) rotate(${5 + x * 3}deg)`;
  }, { passive: true });
  storySection.addEventListener('pointerleave', () => { storyFrame.style.transform = ''; });
}

const parallaxItems = document.querySelectorAll('.manifesto-art, .story-visual, .work-image');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, { threshold: 0.15 });
  parallaxItems.forEach((item) => parallaxObserver.observe(item));
}

// Scroll progress drives the large editorial scenes and their custom graphics.
const scrollScenes = [...document.querySelectorAll('[data-scroll-scene]')];
let sceneTicking = false;
function updateScrollScenes() {
  const viewportHeight = window.innerHeight || 1;
  scrollScenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    let progress = 0;
    if (scene.classList.contains('process-step')) {
      const track = scene.closest('.process-track');
      const trackRect = track.getBoundingClientRect();
      const travel = Math.max(1, track.offsetHeight - viewportHeight);
      const overall = Math.max(0, Math.min(1, -trackRect.top / travel));
      const stepIndex = [...track.querySelectorAll('.process-step')].indexOf(scene);
      progress = Math.max(0, Math.min(1, overall * track.querySelectorAll('.process-step').length - stepIndex));
    } else {
      const section = scene.closest('.manifesto, .story');
      const sectionRect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - viewportHeight);
      progress = Math.max(0, Math.min(1, -sectionRect.top / travel));
    }
    scene.style.setProperty('--progress', progress.toFixed(3));
  });
  sceneTicking = false;
}
window.addEventListener('scroll', () => {
  if (!sceneTicking) {
    requestAnimationFrame(updateScrollScenes);
    sceneTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollScenes, { passive: true });
updateScrollScenes();

// Sequential service cards: the active step follows the viewport center.

const filmScroll = document.querySelector('[data-video-scroll]');
if (filmScroll) {
  const mobileLayout = window.matchMedia('(max-width: 760px)').matches;
  if (mobileLayout) {
    const mobileClips = [...filmScroll.querySelectorAll('.mobile-film-card video')];
    mobileClips.forEach((video) => {
      video.addEventListener('loadedmetadata', () => {
        const media = video.closest('.mobile-film-media');
        media.classList.toggle('is-portrait', video.videoHeight > video.videoWidth);
        media.classList.toggle('is-landscape', video.videoWidth >= video.videoHeight);
      });
      video.addEventListener('error', () => video.closest('.mobile-film-card').classList.add('clip-error'));
    });
    const clipObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = video.dataset.src;
            video.load();
          }
          video.play().catch(() => {});
          entry.target.closest('.mobile-film-card').classList.add('clip-active');
        } else {
          video.pause();
          entry.target.closest('.mobile-film-card').classList.remove('clip-active');
        }
      });
    }, { rootMargin: '80px 0px 80px 0px', threshold: 0.25 });
    mobileClips.forEach((video) => clipObserver.observe(video));
  } else {
    const filmStage = filmScroll.querySelector('.film-stage');
    const filmVideo = filmScroll.querySelector('.film-video');
    const filmTitle = filmScroll.querySelector('.film-chapter h3');
    const filmCopy = filmScroll.querySelector('.film-chapter p');
    const chapters = [
      { src: 'public/assets/video/web/storia-eventi.mp4', title: 'Le emozioni di un momento.', copy: 'Ci sono attimi che passano in un secondo e meritano di essere rivissuti. Il racconto comincia da lì.' },
      { src: 'public/assets/video/web/brand-film.mp4', title: 'Una visione prende forma.', copy: 'Ogni progetto ha una personalità. Immagini, suono e ritmo la rendono riconoscibile.' },
      { src: 'public/assets/video/web/video-social.mp4', title: 'Un’immagine apre una porta.', copy: 'La prima impressione conta: creiamo contenuti che fermano lo sguardo e invitano a conoscere.' },
      { src: 'public/assets/video/web/produzione-live.mp4', title: 'La tua storia continua.', copy: 'Il video giusto trova il suo spazio tra website, social e campagne, e porta il tuo messaggio più lontano.' }
    ];
    let activeChapter = -1;
    let filmVisible = false;
    let pendingResume = null;
    filmVideo.addEventListener('loadedmetadata', () => {
      filmStage.classList.toggle('is-portrait', filmVideo.videoHeight > filmVideo.videoWidth);
    });
    function updateFilmChapter() {
      if (!filmVisible) return;
      const rect = filmScroll.getBoundingClientRect();
      const travel = Math.max(1, filmScroll.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      filmStage.style.setProperty('--film-progress', progress.toFixed(3));
      const index = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
      if (index !== activeChapter) {
        activeChapter = index;
        const chapter = chapters[index];
        filmTitle.textContent = chapter.title;
        filmCopy.textContent = chapter.copy;
        filmVideo.style.opacity = '0.15';
        if (pendingResume) filmVideo.removeEventListener('canplay', pendingResume);
        if (filmVideo.getAttribute('src') !== chapter.src) {
          filmVideo.src = chapter.src;
          filmVideo.load();
        }
        pendingResume = () => {
          if (filmVideo.getAttribute('src') !== chapter.src || !filmVisible) return;
          filmVideo.play().catch(() => {});
          filmVideo.style.opacity = '';
          filmScroll.classList.remove('film-video-error');
          filmVideo.removeEventListener('canplay', pendingResume);
          pendingResume = null;
        };
        filmVideo.addEventListener('canplay', pendingResume);
      }
    }
    const filmObserver = new IntersectionObserver(([entry]) => {
      filmVisible = entry.isIntersecting;
      if (filmVisible) {
        updateFilmChapter();
        filmVideo.play().catch(() => {});
      } else filmVideo.pause();
    }, { threshold: 0.01 });
    filmObserver.observe(filmScroll);
    filmVideo.addEventListener('error', () => filmScroll.classList.add('film-video-error'));
    window.addEventListener('scroll', updateFilmChapter, { passive: true });
    window.addEventListener('resize', updateFilmChapter, { passive: true });
    updateFilmChapter();
  }
}

// Privacy controls: optional services are never requested before affirmative consent.
// Add the real provider IDs here only when the corresponding accounts are configured.
const PRIVACY_CONFIG = {
  googleAnalyticsId: '', // e.g. G-XXXXXXXXXX
  metaPixelId: '' // e.g. 123456789012345
};
const CONSENT_KEY = 'gg-produzioni-consent-v1';
const cookieBanner = document.querySelector('#cookie-banner');
const cookieDialog = document.querySelector('#cookie-dialog');
const consentInputs = {
  analytics: document.querySelector('#consent-analytics'),
  marketing: document.querySelector('#consent-marketing'),
  external: document.querySelector('#consent-external')
};

function readConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
  catch { return null; }
}

function loadGoogleAnalytics() {
  if (!PRIVACY_CONFIG.googleAnalyticsId || window.__ggGaLoaded) return;
  window.__ggGaLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(PRIVACY_CONFIG.googleAnalyticsId)}`;
  document.head.append(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', PRIVACY_CONFIG.googleAnalyticsId, { anonymize_ip: true });
}

function loadMetaPixel() {
  if (!PRIVACY_CONFIG.metaPixelId || window.__ggMetaLoaded) return;
  window.__ggMetaLoaded = true;
  !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', PRIVACY_CONFIG.metaPixelId);
  window.fbq('track', 'PageView');
}

function enableExternalEmbeds() {
  document.querySelectorAll('[data-youtube-id]').forEach((placeholder) => {
    if (placeholder.dataset.loaded === 'true') return;
    const id = placeholder.dataset.youtubeId;
    if (!/^[\w-]{11}$/.test(id || '')) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    frame.title = placeholder.dataset.title || 'Video YouTube';
    frame.loading = 'lazy';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    placeholder.replaceChildren(frame);
    placeholder.dataset.loaded = 'true';
  });
  document.querySelectorAll('[data-instagram-embed]').forEach((placeholder) => {
    const url = placeholder.dataset.instagramEmbed;
    if (!placeholder.dataset.loaded && url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Apri il contenuto su Instagram ↗';
      placeholder.replaceChildren(link);
      placeholder.dataset.loaded = 'true';
    }
  });
}

function applyConsent(consent) {
  if (consent.analytics) loadGoogleAnalytics();
  if (consent.marketing) loadMetaPixel();
  if (consent.external) enableExternalEmbeds();
}

function storeConsent(consent) {
  const complete = { necessary: true, analytics: Boolean(consent.analytics), marketing: Boolean(consent.marketing), external: Boolean(consent.external), savedAt: new Date().toISOString() };
  const previous = readConsent();
  localStorage.setItem(CONSENT_KEY, JSON.stringify(complete));
  const revoked = previous && ['analytics', 'marketing', 'external'].some((key) => previous[key] && !complete[key]);
  if (revoked) { window.location.reload(); return; }
  cookieBanner.hidden = true;
  if (cookieDialog.open) cookieDialog.close();
  applyConsent(complete);
}

function openCookiePreferences() {
  const current = readConsent();
  Object.entries(consentInputs).forEach(([key, input]) => { input.checked = Boolean(current?.[key]); });
  if (cookieDialog && !cookieDialog.open) cookieDialog.showModal();
}

if (cookieBanner && cookieDialog) {
  const savedConsent = readConsent();
  cookieBanner.hidden = Boolean(savedConsent);
  if (savedConsent) applyConsent(savedConsent);
  document.querySelectorAll('[data-cookie-settings]').forEach((button) => button.addEventListener('click', openCookiePreferences));
  document.querySelector('[data-cookie-customize]')?.addEventListener('click', openCookiePreferences);
  document.querySelectorAll('[data-cookie-reject]').forEach((button) => button.addEventListener('click', () => storeConsent({})));
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => storeConsent({ analytics: true, marketing: true, external: true }));
  document.querySelector('[data-cookie-save]')?.addEventListener('click', () => storeConsent(Object.fromEntries(Object.entries(consentInputs).map(([key, input]) => [key, input.checked]))));
  cookieDialog.addEventListener('click', (event) => { if (event.target === cookieDialog) cookieDialog.close(); });
  if (new URLSearchParams(window.location.search).has('privacy-settings')) openCookiePreferences();
}

// Future YouTube/Instagram embeds stay blank until the relevant category is enabled.
document.querySelectorAll('[data-youtube-id], [data-instagram-embed]').forEach((embed) => {
  if (readConsent()?.external) return;
  const gate = document.createElement('button');
  gate.type = 'button';
  gate.className = 'external-consent-gate';
  gate.textContent = 'Consenti i contenuti esterni per visualizzare';
  gate.addEventListener('click', openCookiePreferences);
  embed.append(gate);
});

// The Instagram-style preview uses self-hosted portfolio clips; only the profile link leaves the site.
const previewClips = document.querySelectorAll('[data-preview-src]');
if (previewClips.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const clip = entry.target;
      if (entry.isIntersecting) {
        if (!clip.src) {
          clip.src = clip.dataset.previewSrc;
          clip.load();
        }
        clip.play().catch(() => {});
      } else {
        clip.pause();
      }
    });
  }, { rootMargin: '180px 0px', threshold: 0.1 });
  previewClips.forEach((clip) => previewObserver.observe(clip));
}
