/* ============================================
   RITIK JAYASWAL — ANIMATION ENGINE
   GSAP + ScrollTrigger + Custom Cursor
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Wait for GSAP to load
  const initInterval = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      clearInterval(initInterval);
      gsap.registerPlugin(ScrollTrigger);
      initAll();
    }
  }, 50);

  function initAll() {
    initCustomCursor();
    initGridOverlay();
    initPageLoadSequence();
    initScrollAnimations();
    initNavigation();
    initFormHandling();
    initMobileNav();
    initSmoothScroll();
  }

  /* ============================================
     CUSTOM CURSOR (Desktop Only)
     ============================================ */
  function initCustomCursor() {
    if (window.innerWidth < 768) return;

    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Outline follows with slight lag
    function animateOutline() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover state for interactive elements
    const hoverElements = document.querySelectorAll('[data-hover]');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovering');
        outline.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovering');
        outline.classList.remove('hovering');
      });
    });
  }

  /* ============================================
     BLUEPRINT GRID OVERLAY
     ============================================ */
  function initGridOverlay() {
    if (window.innerWidth < 768) return;

    const hLines = document.getElementById('hLines');
    const vLines = document.getElementById('vLines');
    if (!hLines || !vLines) return;

    const spacing = 64;
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Create horizontal lines
    const hCount = Math.ceil(vh / spacing) + 1;
    for (let i = 0; i < hCount; i++) {
      const line = document.createElement('div');
      line.className = 'h-line';
      line.style.top = (i * spacing) + 'px';
      hLines.appendChild(line);
    }

    // Create vertical lines
    const vCount = Math.ceil(vw / spacing) + 1;
    for (let i = 0; i < vCount; i++) {
      const line = document.createElement('div');
      line.className = 'v-line';
      line.style.left = (i * spacing) + 'px';
      vLines.appendChild(line);
    }
  }

  /* ============================================
     PAGE LOAD SEQUENCE
     ============================================ */
  function initPageLoadSequence() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 0.0s — Grid lines draw in
    if (window.innerWidth >= 768) {
      tl.to('.h-line', {
        width: '100%',
        duration: 1.2,
        stagger: 0.03,
        ease: 'power2.out'
      }, 0);

      tl.to('.v-line', {
        height: '100vh',
        duration: 1.2,
        stagger: 0.03,
        ease: 'power2.out'
      }, 0.3);
    }

    // 0.8s — Background fade
    tl.to('body', {
      backgroundColor: '#0A0A0A',
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.8);

    // 1.0s — Hero label letter-by-letter
    const heroLabel = document.getElementById('heroLabel');
    if (heroLabel) {
      const text = heroLabel.textContent;
      heroLabel.innerHTML = '';
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        if (char === ' ') span.style.width = '0.3em';
        heroLabel.appendChild(span);
      });

      tl.to(heroLabel, { opacity: 1, duration: 0.01 }, 1.0);
      tl.to(heroLabel.children, {
        opacity: 1,
        duration: 0.04,
        stagger: 0.04,
        ease: 'none'
      }, 1.0);
    }

    // 1.4s — Hero name clip mask reveal
    tl.to('#heroName span', {
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    }, 1.4);

    // 1.8s — Gold rule draws in
    tl.to('#heroGoldRule', {
      width: '100%',
      duration: 0.6,
      ease: 'power2.out'
    }, 1.8);

    // 2.2s — Tagline fade in
    tl.to('#heroTagline', {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, 2.2);

    // 2.6s — CTA buttons
    tl.to('#heroCtas', {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 2.6);

    // 3.0s — Portrait
    tl.to('#heroPortrait', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 3.0);

    // Set initial portrait y
    gsap.set('#heroPortrait', { y: 20 });

    // 3.2s — Scroll indicator
    tl.to('#scrollIndicator', {
      opacity: 1,
      duration: 0.4
    }, 3.2);
  }

  /* ============================================
     SCROLL ANIMATIONS
     ============================================ */
  function initScrollAnimations() {
    const isMobile = window.innerWidth < 768;

    // --- Section Labels: letter-by-letter stagger ---
    document.querySelectorAll('[data-anim="label"]').forEach(label => {
      const text = label.textContent;
      label.innerHTML = '';
      text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        if (char === ' ') span.style.width = '0.3em';
        label.appendChild(span);
      });

      ScrollTrigger.create({
        trigger: label,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (isMobile) {
            gsap.to(label.children, { opacity: 1, duration: 0.4 });
          } else {
            gsap.to(label.children, {
              opacity: 1,
              duration: 0.03,
              stagger: 0.03,
              ease: 'none'
            });
          }
        }
      });
    });

    // --- Section Titles: clip mask reveal ---
    document.querySelectorAll('[data-anim="title"]').forEach(title => {
      gsap.set(title, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });

      ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(title, {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out'
          });
        }
      });
    });

    // --- Cards: fade up with stagger ---
    document.querySelectorAll('[data-anim="card"]').forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: (i % 3) * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });

    // --- Gold margin rules ---
    document.querySelectorAll('[data-anim="gold-rule"]').forEach(rule => {
      ScrollTrigger.create({
        trigger: rule.parentElement,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(rule, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
    });

    // --- Statement Quote ---
    const statementQuote = document.getElementById('statementQuote');
    if (statementQuote) {
      ScrollTrigger.create({
        trigger: statementQuote,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(statementQuote, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
          gsap.to('#statementRule', {
            width: 80,
            duration: 0.6,
            delay: 0.4,
            ease: 'power2.out'
          });
          gsap.to('#statementAttrib', {
            opacity: 1,
            duration: 0.4,
            delay: 0.6,
            ease: 'power2.out'
          });
        }
      });
    }

    // --- Philosophy blocks: sequential fade ---
    document.querySelectorAll('[data-anim="philosophy"]').forEach((block, i) => {
      ScrollTrigger.create({
        trigger: block,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(block, {
            opacity: 1,
            duration: 0.6,
            delay: i * 0.4,
            ease: 'power2.out'
          });
        }
      });
    });

    // --- Philosophy left rule ---
    document.querySelectorAll('[data-anim="gold-rule-v"]').forEach(rule => {
      ScrollTrigger.create({
        trigger: rule.parentElement,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(rule, {
            opacity: 1,
            duration: 1.0,
            ease: 'power2.out'
          });
        }
      });
    });

    // --- Gold rule lines in sections (draw width) ---
    // Already handled by gold-rule animation above
  }

  /* ============================================
     NAVIGATION
     ============================================ */
  function initNavigation() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScrollY = scrollY;
    }, { passive: true });
  }

  /* ============================================
     FORM HANDLING
     ============================================ */
  function initFormHandling() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmit');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate required fields
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const matter = document.getElementById('formMatter').value;
      const description = document.getElementById('formDescription').value.trim();

      if (!name || !phone || !matter) return;

      // Update button state to sending
      const originalText = submitBtn.querySelector('span').textContent;
      submitBtn.querySelector('span').textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, phone, matter, description }),
        });

        if (response.ok) {
          // Success animation
          submitBtn.classList.add('sent');
          submitBtn.querySelector('span').textContent = 'Message Sent ✓';
          form.reset();
        } else {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to send message');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        submitBtn.querySelector('span').textContent = 'Error. Try Again';
      } finally {
        submitBtn.disabled = false;
        // Reset button state
        setTimeout(() => {
          submitBtn.classList.remove('sent');
          submitBtn.querySelector('span').textContent = originalText;
        }, 3000);
      }
    });
  }

  /* ============================================
     MOBILE NAV
     ============================================ */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('mobileNav');
    const close = document.getElementById('mobileNavClose');
    if (!toggle || !overlay || !close) return;

    toggle.addEventListener('click', () => {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close on link click
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================
     SMOOTH SCROLL
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offset = 80; // Account for fixed nav
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

});
