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
