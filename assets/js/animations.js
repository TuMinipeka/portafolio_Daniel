function initScrollAnimations() {
  /* Section headers */
  $$('.section-tag, .section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, y: 28, duration: 0.75, ease: 'power3.out'
    });
  });

  /* About — gsap.set + onEnter evita que immediateRender deje elementos en opacity:0 */
  gsap.set('.avatar-frame', { opacity: 0, x: -52 });
  ScrollTrigger.create({
    trigger: '#about', start: 'top 74%', once: true,
    onEnter() {
      gsap.to('.avatar-frame', { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  });

  gsap.set('.about-text', { opacity: 0, x: 50 });
  ScrollTrigger.create({
    trigger: '#about', start: 'top 74%', once: true,
    onEnter() {
      gsap.to('.about-text', { opacity: 1, x: 0, stagger: 0.18, duration: 0.8, delay: 0.25, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  });

  gsap.set('.chip', { opacity: 0, y: 16, scale: 0.85 });
  ScrollTrigger.create({
    trigger: '.about-chips', start: 'top 92%', once: true,
    onEnter() {
      gsap.to('.chip', { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.45, ease: 'back.out(1.7)', clearProps: 'transform,opacity' });
    }
  });

  /* Skills — trigger en la card, no en la barra de 3px */
  $$('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 87%', once: true },
      opacity: 0, y: 40, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
    });
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
            delay: 0.45 + j * 0.12
          });
        });
      }
    });
  });

  /* Projects — set explícito → to (evita immediateRender ocultando cards) */
  gsap.set('.proj-card', { opacity: 0, y: 44 });
  ScrollTrigger.create({
    trigger: '.projects-grid',
    start: 'top 90%',
    once: true,
    onEnter() {
      gsap.to('.proj-card:not(.hidden)', {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.75,
        ease: 'power3.out', clearProps: 'transform,opacity'
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
      scale: 0, opacity: 0, duration: 0.4, delay: i * 0.08, ease: 'back.out(2)'
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
    width: '100%', ease: 'none'
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
