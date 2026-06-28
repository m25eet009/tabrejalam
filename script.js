// ============================================================
// TABREJ ALAM — PORTFOLIO — script.js
// ============================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ----------------------------------------------------------
   Mobile nav toggle
---------------------------------------------------------- */
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('is-open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
});

/* ----------------------------------------------------------
   Scroll progress bar
---------------------------------------------------------- */
const scrollFill = document.getElementById('scrollFill');
function updateScrollBar() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  scrollFill.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateScrollBar, { passive: true });
updateScrollBar();

/* ----------------------------------------------------------
   Nav background intensifies on scroll
---------------------------------------------------------- */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navEl.style.borderColor = 'rgba(94,234,212,0.18)';
  } else {
    navEl.style.borderColor = 'transparent';
  }
}, { passive: true });

/* ----------------------------------------------------------
   Reveal-on-scroll for sections
---------------------------------------------------------- */
const revealTargets = document.querySelectorAll(
  '.about__text, .about__timeline, .r-card, .research__panel, .log__item, .stack__col, .interests, .signal__card, .contact__card, .section__head'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => io.observe(el));

/* ----------------------------------------------------------
   Background ambient network canvas
   Nodes drift slowly, connections fade in/out based on
   proximity -- a quiet rendering of "many clients, loosely
   connected," matching the federated-learning subject matter.
---------------------------------------------------------- */
(function backgroundNetwork() {
  const canvas = document.getElementById('net-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let nodes = [];
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = document.documentElement.scrollHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    const count = Math.max(18, Math.floor((w * h) / 70000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.4 + 0.6
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const viewTop = window.scrollY - 200;
    const viewBottom = window.scrollY + window.innerHeight + 200;

    for (let n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }

    // draw connections (only within viewport range for perf)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (a.y < viewTop || a.y > viewBottom) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        if (b.y < viewTop || b.y > viewBottom) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.globalAlpha = (1 - dist / 140) * 0.18;
          ctx.strokeStyle = '#5eead4';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // draw nodes
    for (let n of nodes) {
      if (n.y < viewTop || n.y > viewBottom) continue;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#5eead4';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(step);
})();

/* ----------------------------------------------------------
   Hero federated-learning diagram (SVG)
   Renders a central server + orbiting client nodes, with
   animated "gradient packets" pulsing inward and outward.
   This is the page's signature visual element.
---------------------------------------------------------- */
(function fedDiagram() {
  const svg = document.getElementById('fedSvg');
  const NS = 'http://www.w3.org/2000/svg';
  const cx = 210, cy = 210;
  const serverR = 26;
  const clientCount = 6;
  const orbitR = 150;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // central server
  const serverGroup = el('g', {});
  const serverGlow = el('circle', {
    cx, cy, r: serverR + 14, fill: 'rgba(94,234,212,0.08)'
  });
  const serverCircle = el('circle', {
    cx, cy, r: serverR, class: 'node-dot node-dot--server'
  });
  const serverLabel = el('text', {
    x: cx, y: cy + 4, 'text-anchor': 'middle', class: 'node-label',
    style: 'fill:#0a0c10;font-weight:600;font-size:9px;'
  });
  serverLabel.textContent = 'SERVER';
  serverGroup.appendChild(serverGlow);
  serverGroup.appendChild(serverCircle);
  serverGroup.appendChild(serverLabel);
  svg.appendChild(serverGroup);

  const clientPositions = [];
  for (let i = 0; i < clientCount; i++) {
    const angle = (Math.PI * 2 * i) / clientCount - Math.PI / 2;
    const x = cx + orbitR * Math.cos(angle);
    const y = cy + orbitR * Math.sin(angle);
    clientPositions.push({ x, y, angle });

    // edge line
    const edge = el('line', {
      x1: cx, y1: cy, x2: x, y2: y, class: 'edge-line'
    });
    svg.appendChild(edge);
  }

  clientPositions.forEach((pos, i) => {
    const g = el('g', {});
    const dot = el('circle', {
      cx: pos.x, cy: pos.y, r: 13, class: 'node-dot'
    });
    const label = el('text', {
      x: pos.x, y: pos.y + 3, 'text-anchor': 'middle', class: 'node-label'
    });
    label.textContent = 'C' + (i + 1);
    g.appendChild(dot);
    g.appendChild(label);
    svg.appendChild(g);

    // animated packet traveling from client to server and back
    if (!reduceMotion) {
      const packet = el('circle', { r: 3, class: 'pulse-packet' });
      svg.appendChild(packet);
      animatePacket(packet, pos.x, pos.y, cx, cy, i * 480);
    }
  });

  function animatePacket(packetEl, x1, y1, x2, y2, delay) {
    const duration = 2600;
    const totalCycle = duration * 2;
    const start = performance.now() + delay;

    function frame(now) {
      let t = (now - start) % totalCycle;
      if (t < 0) { requestAnimationFrame(frame); return; }
      let progress, fromX, fromY, toX, toY;
      if (t < duration) {
        progress = t / duration;
        fromX = x1; fromY = y1; toX = x2; toY = y2;
      } else {
        progress = (t - duration) / duration;
        fromX = x2; fromY = y2; toX = x1; toY = y1;
      }
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const px = fromX + (toX - fromX) * ease;
      const py = fromY + (toY - fromY) * ease;
      packetEl.setAttribute('cx', px);
      packetEl.setAttribute('cy', py);
      packetEl.style.opacity = (progress < 0.05 || progress > 0.95) ? 0 : 0.95;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
