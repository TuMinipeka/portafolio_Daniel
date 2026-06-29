/* =============================================
   GSAP PORTFOLIO — Daniel Mayorga
   ============================================= */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* =============================================
   UTILITIES
   ============================================= */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =============================================
   LOADER
   ============================================= */
function initLoader() {
  const loader = $('#loader');
  const bar    = $('.loader-bar');
  const pct    = $('.loader-pct');

  gsap.to(bar, {
    width: '100%',
    duration: 1.8,
    ease: 'power2.inOut',
    onUpdate() {
      pct.textContent = Math.round(this.progress() * 100) + '%';
    },
    onComplete() {
      const tl = gsap.timeline({
        onComplete() {
          loader.style.display = 'none';
          document.body.classList.remove('is-loading');
          ScrollTrigger.refresh();
          initHero();
        }
      });
      tl.to('.loader-inner', { opacity: 0, y: -24, duration: 0.45, ease: 'power2.in' });
      tl.to(loader, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' });
    }
  });
}

/* =============================================
   PARTICLES CANVAS
   ============================================= */
function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const mouse = { x: -9999, y: -9999 };

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Dot {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.r  = Math.random() * 1.4 + 0.4;
      this.o  = Math.random() * 0.45 + 0.1;
    }
    tick() {
      this.x += this.vx;
      this.y += this.vy;
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        const a = Math.atan2(dy, dx);
        const f = (90 - d) / 90;
        this.x += Math.cos(a) * f * 1.8;
        this.y += Math.sin(a) * f * 1.8;
      }
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      this.x = Math.max(0, Math.min(W, this.x));
      this.y = Math.max(0, Math.min(H, this.y));
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.o})`;
      ctx.fill();
    }
  }

  const count = Math.min(110, Math.floor(W * H / 9500));
  const dots  = Array.from({ length: count }, () => new Dot());

  function drawLines() {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 115) * 0.13})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  (function frame() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.tick(); d.draw(); });
    drawLines();
    requestAnimationFrame(frame);
  })();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

/* =============================================
   CUSTOM CURSOR
   ============================================= */
function initCursor() {
  const outer = $('.cursor-outer');
  const inner = $('.cursor-inner');
  if (!outer || window.matchMedia('(hover: none)').matches) return;

  let ox = 0, oy = 0, mx = 0, my = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(inner, { x: mx, y: my, duration: 0.08, ease: 'power2.out' });
  });

  (function lerpCursor() {
    ox += (mx - ox) * 0.1;
    oy += (my - oy) * 0.1;
    gsap.set(outer, { x: ox, y: oy });
    requestAnimationFrame(lerpCursor);
  })();

  $$('a, button, .filter-btn, .proj-card, .social, .chip, .s-dot').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });
}

/* =============================================
   MAGNETIC BUTTONS
   ============================================= */
function initMagnetic() {
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
      gsap.to(el, { x, y, duration: 0.35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
    });
  });
}

/* =============================================
   3D CARD TILT
   ============================================= */
function initTilt() {
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) *  10;
      gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

/* =============================================
   HERO ANIMATION
   ============================================= */
function initHero() {
  const nameEl = $('.hero-name');
  if (nameEl) {
    const raw = nameEl.dataset.text;
    nameEl.innerHTML = [...raw].map(c =>
      c === ' '
        ? '<span style="display:inline-block"> </span>'
        : `<span style="display:inline-block">${c}</span>`
    ).join('');
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge',     { opacity: 0, y: 18, duration: 0.6 })
    .from('.hero-name span', { opacity: 0, y: 55, rotateX: -90, stagger: 0.038, duration: 0.75 }, '-=0.2')
    .from('.hero-role',      { opacity: 0, x: -24, duration: 0.55 }, '-=0.35')
    .from('.hero-desc',      { opacity: 0, y: 18,  duration: 0.55 }, '-=0.35')
    .from('.hero-actions',   { opacity: 0, y: 18,  duration: 0.5  }, '-=0.3')
    .from('.stat',           { opacity: 0, y: 18,  stagger: 0.1, duration: 0.5 }, '-=0.3')
    .from('.hero-scroll',    { opacity: 0, y: 16,  duration: 0.5 }, '-=0.2')
    .add(startTypewriter, '-=0.4')
    .add(animateCounters,  '+=0.1');
}

/* =============================================
   TYPEWRITER
   ============================================= */
const roles = [
  'Frontend Developer',
  'UI / UX Engineer',
  'Animation Specialist',
  'React Developer',
  'Web Craftsman'
];
let roleIdx = 0;

function startTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  function next() {
    const text = roles[roleIdx++ % roles.length];
    gsap.to(el, {
      duration: text.length * 0.055,
      text,
      ease: 'none',
      onComplete() {
        gsap.delayedCall(2, () => {
          gsap.to(el, { duration: 0.45, text: '', ease: 'none', onComplete: next });
        });
      }
    });
  }
  next();
}

/* =============================================
   STAT COUNTERS
   ============================================= */
function animateCounters() {
  $$('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const proxy  = { val: 0 };
    gsap.to(proxy, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() { el.textContent = Math.round(proxy.val); }
    });
  });
}

/* =============================================
   SCROLL ANIMATIONS — BUGS CORREGIDOS
   ============================================= */
function initScrollAnimations() {
  /* Section headers */
  $$('.section-tag, .section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 28, duration: 0.75, ease: 'power3.out'
    });
  });

  /* About */
  gsap.from('.avatar-frame', {
    scrollTrigger: { trigger: '#about', start: 'top 74%' },
    opacity: 0, x: -52, duration: 0.95, ease: 'power3.out'
  });
  gsap.from('.about-text', {
    scrollTrigger: { trigger: '#about', start: 'top 74%' },
    opacity: 0, x: 50, stagger: 0.18, duration: 0.8, delay: 0.25, ease: 'power3.out'
  });
  gsap.from('.chip', {
    scrollTrigger: { trigger: '.about-chips', start: 'top 90%' },
    opacity: 0, y: 16, scale: 0.85, stagger: 0.07, duration: 0.45, ease: 'back.out(1.7)'
  });

  /* ── SKILLS FIX: trigger en la card (no en la barra de 3px) ── */
  $$('.skill-card').forEach((card, i) => {
    /* Card entra */
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 87%', once: true },
      opacity: 0, y: 40,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out'
    });
    /* Barras se llenan DESPUÉS de que la card es visible */
    const bars = card.querySelectorAll('.skill-fill');
    ScrollTrigger.create({
      trigger: card,
      start: 'top 87%',
      once: true,
      onEnter() {
        bars.forEach((bar, j) => {
          gsap.to(bar, {
            width: bar.dataset.w + '%',
            duration: 1.3,
            ease: 'power3.out',
            delay: 0.45 + j * 0.12  /* espera a que la card aparezca */
          });
        });
      }
    });
  });

  /* ── PROJECTS FIX: set explícito → to (evita immediateRender ocultando cards) ── */
  gsap.set('.proj-card', { opacity: 0, y: 44 });
  ScrollTrigger.create({
    trigger: '.projects-grid',
    start: 'top 90%',
    once: true,
    onEnter() {
      gsap.to('.proj-card:not(.hidden)', {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      });
    }
  });

  /* Timeline */
  $$('.tl-item').forEach((item, i) => {
    const isLeft = !!item.querySelector('.tl-left');
    gsap.from(item.querySelector('.tl-card'), {
      scrollTrigger: { trigger: item, start: 'top 84%' },
      opacity: 0, x: isLeft ? -45 : 45,
      duration: 0.8, delay: i * 0.08, ease: 'power3.out'
    });
    gsap.from(item.querySelector('.tl-dot'), {
      scrollTrigger: { trigger: item, start: 'top 84%' },
      scale: 0, opacity: 0,
      duration: 0.4, delay: i * 0.08, ease: 'back.out(2)'
    });
  });

  /* Contact */
  gsap.from('.contact-info > *', {
    scrollTrigger: { trigger: '#contact', start: 'top 82%' },
    opacity: 0, x: -36, stagger: 0.13, duration: 0.75, ease: 'power3.out'
  });
  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 82%' },
    opacity: 0, x: 36, duration: 0.75, delay: 0.2, ease: 'power3.out'
  });

  /* Navbar progress bar */
  gsap.to('#navProgress', {
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    },
    width: '100%',
    ease: 'none'
  });

  /* Hero parallax */
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: -80, opacity: 0.4
  });
}

/* =============================================
   NAVBAR
   ============================================= */
function initNavbar() {
  const nav   = $('#navbar');
  const links = $$('.nav-links a');

  ScrollTrigger.create({
    start: 80,
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled')
  });

  $$('section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 58%', end: 'bottom 58%',
      onEnter:     () => setActive(sec.id),
      onEnterBack: () => setActive(sec.id)
    });
  });

  function setActive(id) {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }

  /* Hamburger */
  const burger     = $('#hamburger');
  const mobileNav  = $('#navMobile');
  const mobileClose = $('#navMobileClose');

  function openMenu() {
    burger.classList.add('open');
    mobileNav.classList.add('open');
    mobileNav.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    gsap.fromTo('.nav-mobile-link',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power3.out', clearProps: 'all' }
    );
  }
  function closeMenu() {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  $$('.nav-mobile-link').forEach(a => a.addEventListener('click', closeMenu));
}

/* =============================================
   PROJECT FILTER (CORREGIDO)
   ============================================= */
function initFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.proj-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      let visibleIdx = 0;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        if (show) {
          card.classList.remove('hidden');
          gsap.fromTo(card,
            { opacity: 0, y: 22, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.42, delay: visibleIdx * 0.06, ease: 'power3.out', clearProps: 'transform' }
          );
          visibleIdx++;
        } else {
          gsap.to(card, {
            opacity: 0, scale: 0.95, duration: 0.25, ease: 'power2.in',
            onComplete() { card.classList.add('hidden'); }
          });
        }
      });
    });
  });
}

/* =============================================
   PROJECT MODAL (NUEVO)
   ============================================= */
function initModal() {
  const modal    = $('#projModal');
  const backdrop = $('#modalBackdrop');
  const closeBtn = $('#modalClose');
  if (!modal) return;

  function openModal(card) {
    const num   = card.querySelector('.proj-num')?.textContent  || '';
    const title = card.querySelector('.proj-title')?.textContent || '';
    const desc  = card.querySelector('.proj-desc')?.textContent  || '';
    const stacks = [...card.querySelectorAll('.proj-stack span')].map(s => s.textContent);
    const imgEl  = card.querySelector('.proj-img');
    const grad   = imgEl?.style.getPropertyValue('--g') || 'linear-gradient(135deg,#667eea,#764ba2)';
    const projLinks = card.querySelectorAll('.proj-link');
    const demoLink  = projLinks[0]?.getAttribute('href') || '#';
    const codeLink  = projLinks[1]?.getAttribute('href') || '#';

    $('#modalNum').textContent   = num;
    $('#modalTitle').textContent = title;
    $('#modalDesc').textContent  = desc;
    $('#modalImg').style.background = grad;
    $('#modalDemo').href = demoLink;
    $('#modalCode').href = codeLink;
    $('#modalStack').innerHTML = stacks.map(s => `<span>${s}</span>`).join('');

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(modal,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    gsap.fromTo('.p-modal__box',
      { scale: 0.88, y: 28 },
      { scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }
    );
  }

  function closeModal() {
    gsap.to('.p-modal__box', { scale: 0.92, y: 20, duration: 0.22, ease: 'power2.in' });
    gsap.to(modal, {
      opacity: 0, duration: 0.3, delay: 0.05, ease: 'power2.in',
      onComplete() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  $$('.proj-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.proj-link')) return; /* no abrir modal al clicar links directos */
      openModal(card);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

/* =============================================
   BACK TO TOP (NUEVO)
   ============================================= */
function initBackToTop() {
  const btn = $('#backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   SECTION NAV DOTS (NUEVO)
   ============================================= */
function initSectionDots() {
  const dots = $$('.s-dot');
  if (!dots.length) return;

  const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];

  sectionIds.forEach(id => {
    const sec = $(`#${id}`);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end:   'bottom 55%',
      onEnter:     () => activeDot(id),
      onEnterBack: () => activeDot(id)
    });
  });

  function activeDot(id) {
    dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === `#${id}`));
  }

  /* Entrada animada */
  gsap.from(dots, {
    opacity: 0, x: 14,
    stagger: 0.08,
    duration: 0.5,
    delay: 2.8,
    ease: 'power3.out'
  });
}

/* =============================================
   SKILL CARD MOUSE GLOW (NUEVO)
   ============================================= */
function initSkillGlow() {
  $$('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-send');
    const text = btn.querySelector('.btn-text');

    text.textContent = 'Enviando…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        text.textContent = '¡Enviado! ✓';
        btn.style.background = 'linear-gradient(135deg,#00b894,#00d4ff)';
        gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        form.reset();
        setTimeout(() => {
          text.textContent = 'Enviar Mensaje';
          btn.style.background = '';
          btn.disabled = false;
        }, 3200);
      } else {
        throw new Error();
      }
    } catch {
      text.textContent = 'Error — intentá de nuevo';
      btn.style.background = 'linear-gradient(135deg,#ff2d78,#ff6b6b)';
      setTimeout(() => {
        text.textContent = 'Enviar Mensaje';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

/* =============================================
   FLOATING ORBIT NODES
   ============================================= */
function initOrbitFloat() {
  gsap.to('.orbit-node', {
    y: -12, duration: 2.2,
    ease: 'sine.inOut', yoyo: true, repeat: -1,
    stagger: { each: 0.5 }
  });
}

/* =============================================
   FOOTER YEAR
   ============================================= */
function initFooter() {
  const el = $('#yr');
  if (el) el.textContent = new Date().getFullYear();
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initFooter();
  initNavbar();
  initFilter();
  initContactForm();
  initSectionDots();
  initBackToTop();

  if (prefersReducedMotion) {
    $('#loader').style.display = 'none';
    document.body.classList.remove('is-loading');
    /* Mostrar proyectos y skills sin animación */
    $$('.proj-card').forEach(c => { c.style.opacity = 1; });
    $$('.skill-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
    return;
  }

  initParticles();
  initCursor();
  initMagnetic();
  initTilt();
  initModal();
  initSkillGlow();
  initScrollAnimations();
  initOrbitFloat();
  initLoader();
});
