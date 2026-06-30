// =================================================================
// OTO MOBILES — On Time On Way
// Complete JavaScript — Interactive Features
// Dependencies: GSAP, ScrollTrigger, Three.js (CDN), Lenis
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. LOADER
  // ============================================================
  const loader = document.getElementById('loader');
  const progressBar = document.getElementById('loaderProgress');
  const statusText = document.getElementById('loaderStatus');
  let progress = 0;

  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      statusText.textContent = 'SYSTEM READY // 100%';
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        loader.style.transition = 'opacity .8s ease';
        // Start scroll reveal after loader
        initScrollReveal();
        initCounters();
      }, 400);
    }
    progressBar.style.width = progress + '%';
    statusText.textContent = `INITIALIZING SYSTEM // ${String(progress).padStart(2, '0')}%`;
  }, 80);

  // ============================================================
  // 2. CUSTOM CURSOR
  // ============================================================
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    // Smooth ring follow
    function updateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(${ringX - 19}px, ${ringY - 19}px)`;
      requestAnimationFrame(updateRing);
    }
    updateRing();

    // Hover effects
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const type = el.dataset.cursor;
        if (type === 'hover') cursorRing.classList.add('is-hover');
        if (type === 'view') cursorRing.classList.add('is-view');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('is-hover', 'is-view');
      });
    });
  }

  // ============================================================
  // 3. SCROLL PROGRESS & NAVIGATION SCROLL
  // ============================================================
  const scrollProgress = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
    
    nav.classList.toggle('scrolled', scrollTop > 60);
  }, { passive: true });

  // ============================================================
  // 4. DARK / LIGHT THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const toggleIcon = themeToggle.querySelector('i');
    if (toggleIcon) {
      toggleIcon.classList.remove('fa-moon');
      toggleIcon.classList.add('fa-sun');
    }
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const toggleIcon = themeToggle.querySelector('i');
    if (toggleIcon) {
      if (isDark) {
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
      } else {
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
      }
    }
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ============================================================
  // 5. HERO — Three.js Particle System (Orange/Gold theme)
  // ============================================================
  function initHeroParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Particles
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 600 : 1800;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      const color1 = new THREE.Color('#F97316'); // Orange
      const color2 = new THREE.Color('#FBBF24'); // Gold/Amber

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const mix = Math.random();
        const c = color1.clone().lerp(color2, mix);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        sizes[i] = Math.random() * 0.08 + 0.02;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const particleSystem = new THREE.Points(geometry, material);
      scene.add(particleSystem);

      camera.position.z = 12;

      let mouseX = 0, mouseY = 0;
      document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      function animate() {
        requestAnimationFrame(animate);
        particleSystem.rotation.x += 0.0003;
        particleSystem.rotation.y += 0.0005;
        particleSystem.rotation.x += mouseY * 0.0005;
        particleSystem.rotation.y += mouseX * 0.0005;
        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });

    } catch (e) {
      // Fallback: canvas shows simple gradient
      const ctx = canvas.getContext('2d');
      function drawFallback() {
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/1.2);
        grad.addColorStop(0, 'rgba(249,115,22,0.15)');
        grad.addColorStop(0.5, 'rgba(251,191,36,0.05)');
        grad.addColorStop(1, 'rgba(17,17,17,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Draw random dots
        for (let i = 0; i < 200; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249,115,22,${Math.random() * 0.3})`;
          ctx.fill();
        }
      }
      drawFallback();
      window.addEventListener('resize', drawFallback);
    }
  }
  initHeroParticles();

  // ============================================================
  // 6. STORY — ScrollTrigger Exploded View
  // ============================================================
  function initStory() {
    const storyCanvas = document.getElementById('storyCanvas');
    const steps = document.querySelectorAll('.story-step');
    const label = document.getElementById('storyLabel');
    const labelName = document.querySelector('.story-label-name');
    const labelNote = document.querySelector('.story-label-note');

    if (!storyCanvas || !steps.length) return;

    const ctx = storyCanvas.getContext('2d');
    let width, height;

    function resize() {
      const rect = storyCanvas.parentElement.getBoundingClientRect();
      width = storyCanvas.width = rect.width;
      height = storyCanvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    // Draw phone parts
    const parts = [
      { name: 'Display', note: 'Crack detected • 78% integrity', color: '#F97316', x: 0, y: 0, w: 0.5, h: 0.7 },
      { name: 'Battery', note: 'Health: 82% • Cycle count: 342', color: '#FBBF24', x: -0.2, y: 0.6, w: 0.3, h: 0.15 },
      { name: 'Mainboard', note: 'All circuits functional', color: '#111111', x: -0.25, y: 0.2, w: 0.25, h: 0.25 },
      { name: 'Camera', note: 'Lens scratch • Focus OK', color: '#EA580C', x: 0.35, y: -0.3, w: 0.15, h: 0.15 },
    ];

    let activePart = -1;
    let progress = 0;

    function drawScene(p) {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.3;

      // Draw phone outline
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1 + p * 0.05, 1 + p * 0.05);

      // Phone body
      const pw = scale * 0.5;
      const ph = scale * 0.85;
      ctx.strokeStyle = `rgba(255,255,255,${0.2 + p * 0.3})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(-pw/2, -ph/2, pw, ph);

      // Draw parts with explosion effect
      parts.forEach((part, i) => {
        const explodeOffset = p * 80;
        const dx = part.x * scale + (part.x / 0.5) * explodeOffset * 0.3;
        const dy = part.y * scale + (part.y / 0.5) * explodeOffset * 0.3;
        const dw = part.w * scale;
        const dh = part.h * scale;

        const isActive = (i === activePart);
        ctx.fillStyle = isActive ? part.color : `rgba(255,255,255,0.15)`;
        ctx.strokeStyle = isActive ? part.color : `rgba(255,255,255,0.3)`;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.shadowColor = isActive ? part.color : 'transparent';
        ctx.shadowBlur = isActive ? 20 : 0;

        ctx.fillRect(dx - dw/2, dy - dh/2, dw, dh);
        ctx.strokeRect(dx - dw/2, dy - dh/2, dw, dh);

        ctx.shadowBlur = 0;

        // Label
        if (p > 0.3) {
          ctx.fillStyle = isActive ? '#fff' : 'rgba(255,255,255,0.4)';
          ctx.font = `${isActive ? 14 : 10}px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(part.name, dx, dy + dh/2 + 24);
        }
      });

      ctx.restore();

      // HUD overlay
      ctx.fillStyle = `rgba(249,115,22,${0.1 + p * 0.15})`;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillText(`EXPLODED VIEW // ${Math.round(p * 100)}%`, 16, 30);
    }

    // Use GSAP + ScrollTrigger for the story
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const storySection = document.querySelector('.story');
      const pin = document.querySelector('.story-pin');

      ScrollTrigger.create({
        trigger: storySection,
        start: 'top top',
        end: 'bottom bottom',
        pin: pin,
        pinSpacing: true,
        onUpdate: (self) => {
          progress = self.progress;
          drawScene(progress);

          // Update step visibility
          const stepIndex = Math.floor(progress * steps.length);
          steps.forEach((step, i) => {
            step.style.opacity = (i === stepIndex && progress > 0.05) ? '1' : '0';
            step.style.transform = (i === stepIndex) ? 'translateY(0)' : 'translateY(20px)';
            step.style.transition = 'opacity 0.4s, transform 0.4s';
          });

          // Update label
          const partIndex = Math.floor(progress * parts.length);
          if (partIndex < parts.length && progress > 0.1) {
            const part = parts[partIndex];
            label.style.display = 'block';
            labelName.textContent = part.name;
            labelNote.textContent = part.note;
            labelName.style.color = part.color;
          } else {
            label.style.display = 'none';
          }
        }
      });
    } else {
      // Fallback: simple animation loop
      let p = 0;
      function fallbackAnimate() {
        p = (p + 0.005) % 1;
        drawScene(p);
        requestAnimationFrame(fallbackAnimate);
      }
      fallbackAnimate();
    }

    // Click to change active part
    storyCanvas.addEventListener('click', (e) => {
      activePart = (activePart + 1) % parts.length;
    });
  }
  initStory();

  // ============================================================
  // 7. TILT EFFECT ON CARDS
  // ============================================================
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ============================================================
  // 8. SERVICE CARD DETAIL ACCORDION
  // ============================================================
  document.querySelectorAll('[data-service-toggle]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking a link inside
      if (e.target.closest('a')) return;

      const detail = card.querySelector('.service-detail');
      if (!detail) return;

      const isOpen = card.classList.contains('detail-open');

      // Close all others
      document.querySelectorAll('[data-service-toggle]').forEach(other => {
        if (other !== card) {
          other.classList.remove('detail-open');
          const otherDetail = other.querySelector('.service-detail');
          if (otherDetail) otherDetail.style.maxHeight = '0';
        }
      });

      // Toggle current
      card.classList.toggle('detail-open');
      if (isOpen) {
        detail.style.maxHeight = '0';
      } else {
        detail.style.maxHeight = detail.scrollHeight + 'px';
      }
    });
  });

  // ============================================================
  // 9. SCROLL REVEAL (GSAP)
  // ============================================================
  function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: simple IntersectionObserver
      const els = document.querySelectorAll('[data-reveal]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.15 });
      els.forEach(el => observer.observe(el));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Reveal elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Hero title line reveal
    document.querySelectorAll('[data-reveal-line] span').forEach(line => {
      gsap.to(line, {
        y: '0%',
        duration: 1.2,
        delay: 0.15,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: line.closest('.hero-title'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Phone cards reveal with stagger
    document.querySelectorAll('.phone-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card.closest('.phone-grid'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Process steps stagger
    document.querySelectorAll('.process-step').forEach((step, i) => {
      gsap.to(step, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step.closest('.process-track'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Owner cards
    document.querySelectorAll('.owner-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card.closest('.owners'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item.closest('.timeline'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Stat cards
    document.querySelectorAll('.stat-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card.closest('.stats-grid'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Why Choose items
    document.querySelectorAll('.why-choose-item').forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item.closest('.why-choose-grid'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // ============================================================
  // 10. COUNTER ANIMATION
  // ============================================================
  function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      let current = 0;
      const increment = Math.ceil(target / 60);
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const interval = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              counter.textContent = current.toLocaleString();
            }, 25);
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(counter);
    });
  }

  // ============================================================
  // 11. SCAN LINE ANIMATION
  // ============================================================
  function initScanLine() {
    const scanLine = document.querySelector('.scan-line');
    if (!scanLine) return;

    function animateScan() {
      let pos = -10;
      function step() {
        pos += 0.8;
        if (pos > 110) pos = -10;
        scanLine.style.top = pos + '%';
        requestAnimationFrame(step);
      }
      step();
    }
    animateScan();

    // Value reveal on scroll
    const scanValue = document.getElementById('scanValue');
    if (scanValue) {
      const strong = scanValue.querySelector('strong');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let val = 0;
            const prices = [8500, 22000, 31000, 45000, 18000, 28000];
            const target = prices[Math.floor(Math.random() * prices.length)];
            const interval = setInterval(() => {
              val += Math.floor(target / 40);
              if (val >= target) {
                val = target;
                clearInterval(interval);
              }
              strong.textContent = `₹${val.toLocaleString()}`;
            }, 30);
            observer.unobserve(scanValue);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(scanValue);
    }
  }
  initScanLine();

  // ============================================================
  // 12. FAQ ACCORDION
  // ============================================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close others
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = '0';
        }
      });
      item.classList.toggle('open');
      a.style.maxHeight = isOpen ? '0' : a.scrollHeight + 'px';
    });
  });

  // ============================================================
  // 13. LIGHTBOX
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      lightbox.classList.add('open');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });

  // ============================================================
  // 14. SMOOTH SCROLL (Lenis)
  // ============================================================
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ============================================================
  // 15. FOOTER YEAR
  // ============================================================
  document.getElementById('year').textContent = new Date().getFullYear();

  // ============================================================
  // 16. MOBILE NAV — close on resize to desktop
  // ============================================================
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });



  console.log('🚀 OTO Mobiles — On Time On Way · System Online');
  console.log('📱 Built with ❤️ for Bhilai');

}); // end DOMContentLoaded