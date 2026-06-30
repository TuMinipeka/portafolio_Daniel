function initCursor() {
  const outer = $('.cursor-outer');
  const inner = $('.cursor-inner');
  if (!outer || window.matchMedia('(hover: none)').matches) return;

  let ox = 0, oy = 0, mx = 0, my = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
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

  const burger      = $('#hamburger');
  const mobileNav   = $('#navMobile');
  const mobileClose = $('#navMobileClose');
  let   scrollY     = 0;
  let   menuOpen    = false;

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;

    /* iOS Safari: position:fixed evita que la página se desplace debajo del overlay */
    scrollY = window.scrollY;
    document.body.style.cssText =
      `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%;`;

    burger.classList.add('open');
    mobileNav.classList.add('open');
    mobileNav.removeAttribute('aria-hidden');

    /* Matar animaciones previas antes de reanimar */
    gsap.killTweensOf('.nav-mobile-link');
    gsap.fromTo('.nav-mobile-link',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: 'power3.out', clearProps: 'transform,opacity' }
    );
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;

    gsap.killTweensOf('.nav-mobile-link');
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');

    /* Restaurar scroll exactamente donde estaba */
    document.body.style.cssText = '';
    window.scrollTo(0, scrollY);
  }

  burger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  /* Cerrar al hacer clic en el fondo del overlay */
  mobileNav?.addEventListener('click', e => {
    if (e.target === mobileNav) closeMenu();
  });
  $$('.nav-mobile-link').forEach(a => a.addEventListener('click', closeMenu));
}

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

function initModal() {
  const modal    = $('#projModal');
  const backdrop = $('#modalBackdrop');
  const closeBtn = $('#modalClose');
  if (!modal) return;

  function openModal(card) {
    const num    = card.querySelector('.proj-num')?.textContent   || '';
    const title  = card.querySelector('.proj-title')?.textContent || '';
    const desc   = card.querySelector('.proj-desc')?.textContent  || '';
    const stacks = [...card.querySelectorAll('.proj-stack span')].map(s => s.textContent);
    const imgEl  = card.querySelector('.proj-img');
    const grad   = imgEl?.style.getPropertyValue('--g') || 'linear-gradient(135deg,#667eea,#764ba2)';
    const codeLink = card.querySelector('.proj-link')?.getAttribute('href') || null;

    $('#modalNum').textContent   = num;
    $('#modalTitle').textContent = title;
    $('#modalDesc').textContent  = desc;
    $('#modalImg').style.background = grad;
    $('#modalStack').innerHTML = stacks.map(s => `<span>${s}</span>`).join('');

    /* Mostrar/ocultar botones según si hay repo */
    const actionsEl = $('#modalCode').closest('.p-modal__actions');
    if (codeLink) {
      $('#modalDemo').href = codeLink;
      $('#modalCode').href = codeLink;
      actionsEl.style.display = '';
    } else {
      actionsEl.style.display = 'none';
    }

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo('.p-modal__box', { scale: 0.88, y: 28 }, { scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' });
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
      if (e.target.closest('.proj-link')) return;
      openModal(card);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

function initBackToTop() {
  const btn = $('#backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 320);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSectionDots() {
  const dots = $$('.s-dot');
  if (!dots.length) return;

  ['hero', 'about', 'skills', 'projects', 'experience', 'contact'].forEach(id => {
    const sec = $(`#${id}`);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onEnter:     () => activeDot(id),
      onEnterBack: () => activeDot(id)
    });
  });

  function activeDot(id) {
    dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === `#${id}`));
  }

  gsap.from(dots, { opacity: 0, x: 14, stagger: 0.08, duration: 0.5, delay: 2.8, ease: 'power3.out' });
}

function initSkillGlow() {
  $$('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });
}

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

function initOrbitFloat() {
  gsap.to('.orbit-node', {
    y: -12, duration: 2.2,
    ease: 'sine.inOut', yoyo: true, repeat: -1,
    stagger: { each: 0.5 }
  });
}

function initFooter() {
  const el = $('#yr');
  if (el) el.textContent = new Date().getFullYear();
}
