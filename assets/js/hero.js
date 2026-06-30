const roles = [
  'Junior Backend Developer',
  'Técnico en Software',
  'Automatización con n8n',
  'Robótica & Electrónica',
  'Agentes de IA'
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
