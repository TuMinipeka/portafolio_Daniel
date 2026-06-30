gsap.registerPlugin(ScrollTrigger, TextPlugin);

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
