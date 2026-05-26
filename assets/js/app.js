// ============================================================
// Portfolio App — reads data/portfolio.json and renders all UI
// ============================================================

let DATA = null;

async function init() {
  try {
    const res = await fetch('data/portfolio.json');
    DATA = await res.json();
  } catch (e) {
    console.error('Could not load portfolio.json:', e);
    return;
  }
  renderAll();
  initCursor();
  initScrollReveal();
  initSmoothScroll();
}

function renderAll() {
  renderHero();
  renderSkills();
  renderMajorProjects();
  renderMinorProjects();
  renderCertifications();
  renderFooter();
}

// ── HERO ──────────────────────────────────────────────────────
function renderHero() {
  const p = DATA.personal;
  document.getElementById('hero-name').innerHTML = formatName(p.name);
  document.getElementById('hero-title').textContent = p.title;
  document.getElementById('hero-bio').textContent = p.bio;
  document.getElementById('stat-major').innerHTML = `${p.stats.major_projects}<span>+</span>`;
  document.getElementById('stat-fun').innerHTML = `${p.stats.fun_builds}<span>+</span>`;
  document.getElementById('stat-proto').innerHTML = `${p.stats.protocols}<span>+</span>`;
  document.title = `Portfolio — ${p.name}`;
}

function formatName(name) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return `<span>${name}</span>`;
  const last = parts.pop();
  return `${parts.join(' ')}<br><span>${last}</span><br>Here.`;
}

// ── SKILLS ────────────────────────────────────────────────────
function renderSkills() {
  const s = DATA.skills;
  document.getElementById('tags-boards').innerHTML    = s.boards.map(t => `<span class="tag accent">${t}</span>`).join('');
  document.getElementById('tags-protocols').innerHTML = s.protocols.map(t => `<span class="tag purple">${t}</span>`).join('');
  document.getElementById('tags-languages').innerHTML = s.languages.map(t => `<span class="tag amber">${t}</span>`).join('');
  document.getElementById('tags-tools').innerHTML     = s.tools.map(t => `<span class="tag">${t}</span>`).join('');
}

// ── MAJOR PROJECTS ────────────────────────────────────────────
function renderMajorProjects() {
  const container = document.getElementById('major-projects-list');
  container.innerHTML = DATA.major_projects.map((p, i) => buildProjectEntry(p, i + 1)).join('');
}

function buildProjectEntry(p, num) {
  const numStr = String(num).padStart(2, '0');
  const isWip = p.status === 'wip';
  const statusHtml = isWip
    ? `<span class="project-status status-wip">⟳ In Development</span>`
    : `<span class="project-status status-done">✓ Completed</span>`;

  const bodyHtml = isWip ? buildWipBody(p) : buildProjectBody(p);

  return `
  <div class="project-entry reveal" id="${p.id}">
    <div class="project-header" onclick="toggleProject('${p.id}')">
      <div>
        <div class="project-num">PROJECT — ${numStr}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-summary-short">${p.short_desc}</p>
        <div class="project-badges">${p.badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;flex-shrink:0">
        ${statusHtml}
        <span style="font-family:'Space Mono',monospace;font-size:0.65rem;color:var(--muted)">[ Expand ▾ ]</span>
      </div>
    </div>
    <div class="project-body" style="display:none">${bodyHtml}</div>
  </div>`;
}

function buildProjectBody(p) {
  const swBlocks = Object.entries(p.sw_arch || {}).map(([title, items]) => `
    <div class="arch-block">
      <div class="arch-block-title">${title}</div>
      ${items.map(i => `<div class="arch-item">${i}</div>`).join('')}
    </div>`).join('');

  const hwBlocks = Object.entries(p.hw_arch || {}).map(([title, items]) => `
    <div class="arch-block">
      <div class="arch-block-title">${title}</div>
      ${items.map(i => `<div class="arch-item">${i}</div>`).join('')}
    </div>`).join('');

  const imagesHtml = buildProjectImages(p);
  const protosHtml = (p.protocols || []).map(pr => `<span class="proto-pill">${pr}</span>`).join('');

  return `
    <div class="project-tabs">
      <button class="ptab active" onclick="switchTab('${p.id}','summary',this)">Summary</button>
      <button class="ptab" onclick="switchTab('${p.id}','sw-arch',this)">SW Architecture</button>
      <button class="ptab" onclick="switchTab('${p.id}','hw-arch',this)">HW Architecture</button>
      <button class="ptab" onclick="switchTab('${p.id}','images',this)">Images</button>
      <button class="ptab" onclick="switchTab('${p.id}','protocols',this)">Protocols</button>
      <button class="ptab" onclick="switchTab('${p.id}','github',this)">GitHub</button>
    </div>
    <div id="${p.id}-summary" class="ptab-content active">
      <p class="summary-text">${p.summary}</p>
    </div>
    <div id="${p.id}-sw-arch" class="ptab-content">
      <div class="arch-grid">${swBlocks}</div>
    </div>
    <div id="${p.id}-hw-arch" class="ptab-content">
      <div class="arch-grid">${hwBlocks}</div>
    </div>
    <div id="${p.id}-images" class="ptab-content">
      <div class="project-images-grid">${imagesHtml}</div>
      ${(p.images||[]).length === 0 ? `<p style="color:var(--muted);font-size:0.78rem;margin-top:1.5rem;font-family:'Space Mono',monospace">// Drop images into images/projects/major/${p.id}/ and update portfolio.json</p>` : ''}
    </div>
    <div id="${p.id}-protocols" class="ptab-content">
      <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1.2rem">Protocols implemented in this project:</p>
      <div class="protocols-list">${protosHtml}</div>
    </div>
    <div id="${p.id}-github" class="ptab-content">
      <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1.5rem">Source code, schematics, BOM and documentation.</p>
      <a href="${p.github}" target="_blank" class="github-link">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;fill:currentColor"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.165c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        ${p.github}
      </a>
    </div>`;
}

function buildProjectImages(p) {
  const imgs = (p.images || []).filter(Boolean);
  if (imgs.length === 0) {
    return ['Hardware Setup','PCB Closeup','Software / Dashboard','Field View'].map(label => `
      <div class="proj-img-placeholder">📷<span>${label}</span></div>`).join('');
  }
  return imgs.map(src => `
    <div class="proj-img-wrapper">
      <img src="images/projects/major/${p.id}/${src}" alt="${src}" loading="lazy" onclick="openLightbox(this.src)">
    </div>`).join('');
}

function buildWipBody(p) {
  return `
    <div class="wip-body">
      <div class="wip-icon">🔭</div>
      <div class="wip-label">Under Development</div>
      <p class="wip-sub">${p.wip_note}</p>
      <div class="wip-progress"><div class="wip-bar"></div></div>
    </div>`;
}

// ── MINOR PROJECTS ────────────────────────────────────────────
function renderMinorProjects() {
  const container = document.getElementById('minor-projects-list');
  container.innerHTML = DATA.minor_projects.map((p, idx) => buildMinorCard(p, idx)).join('');
}

function buildMinorCard(p, idx) {
  const images = [];
  if (p.image)  images.push(p.image);
  if (p.image2) images.push(p.image2);

  let mediaHtml;
  if (images.length === 0) {
    mediaHtml = `<div class="minor-img"><span style="font-size:3rem">${p.emoji || '🔧'}</span></div>`;
  } else if (images.length === 1) {
    mediaHtml = `
      <div class="minor-img single-img" onclick="openLightbox('images/projects/minor/${images[0]}')">
        <img src="images/projects/minor/${images[0]}" alt="${p.name}" loading="lazy">
      </div>`;
  } else {
    // Two images — slide between them
    mediaHtml = `
      <div class="minor-img-slider" id="slider-${idx}">
        <div class="minor-slide active" onclick="openLightbox('images/projects/minor/${images[0]}')">
          <img src="images/projects/minor/${images[0]}" alt="${p.name} 1" loading="lazy">
        </div>
        <div class="minor-slide" onclick="openLightbox('images/projects/minor/${images[1]}')">
          <img src="images/projects/minor/${images[1]}" alt="${p.name} 2" loading="lazy">
        </div>
        <div class="slider-nav">
          <button class="slider-btn" onclick="event.stopPropagation();slideMinor(${idx},0)" id="dot-${idx}-0">●</button>
          <button class="slider-btn" onclick="event.stopPropagation();slideMinor(${idx},1)" id="dot-${idx}-1">○</button>
        </div>
        <div class="slider-arrow left-arrow" onclick="event.stopPropagation();slideMinor(${idx},'prev')">‹</div>
        <div class="slider-arrow right-arrow" onclick="event.stopPropagation();slideMinor(${idx},'next')">›</div>
      </div>`;
  }

  return `
  <div class="minor-card">
    ${mediaHtml}
    <div class="minor-body">
      <div class="minor-name">${p.name}</div>
      <div class="minor-desc">${p.desc}</div>
      <div class="minor-chip">${p.chip}</div>
    </div>
  </div>`;
}

function slideMinor(idx, target) {
  const slider = document.getElementById(`slider-${idx}`);
  const slides = slider.querySelectorAll('.minor-slide');
  const dots   = slider.querySelectorAll('.slider-btn');
  let current  = [...slides].findIndex(s => s.classList.contains('active'));

  let next;
  if (target === 'prev') next = (current - 1 + slides.length) % slides.length;
  else if (target === 'next') next = (current + 1) % slides.length;
  else next = target;

  slides[current].classList.remove('active');
  slides[next].classList.add('active');
  dots[current].textContent = '○';
  dots[next].textContent = '●';
}

// ── CERTIFICATIONS ────────────────────────────────────────────
function renderCertifications() {
  renderCertSection('cert-matters-list', DATA.certifications.matters, 'matters');
  renderCertSection('cert-curiosity-list', DATA.certifications.curiosity, 'curiosity');
}

function renderCertSection(containerId, certs, folder) {
  const container = document.getElementById(containerId);
  container.innerHTML = certs.map(c => {
    const hasImg = c.image && c.image.trim() !== '';
    const certImgPath = hasImg ? `images/certifications/${folder}/${c.image}` : '';
    return `
    <div class="cert-card ${hasImg ? 'cert-has-img' : ''}" ${hasImg ? `onclick="openLightbox('${certImgPath}')"` : ''} title="${hasImg ? 'Click to view certificate' : ''}">
      <div class="cert-icon">${c.icon}</div>
      <div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
        <div class="cert-year">${c.year} · ${c.note}</div>
        ${hasImg ? `<div class="cert-view-tag">📄 View Certificate</div>` : `<div class="cert-placeholder-tag">// Add image filename in portfolio.json</div>`}
      </div>
    </div>`;
  }).join('');
}

// ── FOOTER ────────────────────────────────────────────────────
function renderFooter() {
  const p = DATA.personal;
  document.getElementById('footer-email').href = `mailto:${p.email}`;
  document.getElementById('footer-linkedin').href = p.linkedin;
  document.getElementById('footer-github').href = p.github;
}

// ── LIGHTBOX ─────────────────────────────────────────────────
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

// ── PROJECT INTERACTION ───────────────────────────────────────
function toggleProject(id) {
  const body = document.querySelector(`#${id} .project-body`);
  const isOpen = body.style.display === 'block';
  body.style.display = isOpen ? 'none' : 'block';
}

function switchTab(projId, tabId, btn) {
  const proj = document.getElementById(projId);
  proj.querySelectorAll('.ptab-content').forEach(c => c.classList.remove('active'));
  proj.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.getElementById(`${projId}-${tabId}`).classList.add('active');
  btn.classList.add('active');
}

// ── CURSOR ────────────────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
}

// ── SCROLL REVEAL ─────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── SMOOTH SCROLL ─────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

window.addEventListener('DOMContentLoaded', init);
