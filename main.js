// Core GSAP micro-interactions and scroll reveals
// Requires GSAP (cdn included in HTML)

document.addEventListener('DOMContentLoaded', () => {
  // Auto-add reveal class to core content so scroll-reveals activate without editing every HTML file
  document.querySelectorAll('section, article, .apa-reference, .references').forEach(el => el.classList.add('reveal'));

  // Centralized timing and easing variables for consistent feel
  const TIMINGS = {
    load: 0.85,
    short: 0.18,
    navStagger: 0.09,
    reveal: 0.7
  };
  const EASE = 'power3.out';

  // Simple load animation for header (slower, more elegant)
  try {
    gsap.from('header .profile-img', { duration: TIMINGS.load, scale: 0.86, opacity: 0, ease: EASE });
    gsap.from('header h1', { duration: TIMINGS.load, y: 12, opacity: 0, delay: 0.12, ease: EASE });
    gsap.from('nav a', { duration: 0.6, y: 8, opacity: 0, stagger: TIMINGS.navStagger, delay: 0.28, ease: EASE });
  } catch (e) {
    // graceful fallback
    console.warn('GSAP not available', e);
  }

  // Hover micro-interactions (nav and profile) with subtle yoyo for tactile feel
  document.querySelectorAll('nav a').forEach((link) => {
    let hoverTween;
    link.addEventListener('mouseenter', () => {
      hoverTween && hoverTween.kill();
      hoverTween = gsap.to(link, { scale: 1.06, backgroundColor: 'rgba(255,255,255,0.04)', duration: TIMINGS.short, ease: 'power1.out' });
    });
    link.addEventListener('mouseleave', () => {
      hoverTween && hoverTween.kill();
      gsap.to(link, { scale: 1, backgroundColor: 'transparent', duration: TIMINGS.short, ease: 'power1.in' });
    });
  });

  const profile = document.querySelector('.profile-img');
  if (profile) {
    let pTween;
    profile.addEventListener('mouseenter', () => {
      pTween && pTween.kill();
      pTween = gsap.to(profile, { scale: 1.08, rotation: 1.5, duration: 0.28, ease: 'elastic.out(1, 0.6)' });
    });
    profile.addEventListener('mouseleave', () => {
      pTween && pTween.kill();
      gsap.to(profile, { scale: 1, rotation: 0, duration: 0.28, ease: 'power2.inOut' });
    });
  }

  // Scroll reveal: observe .reveal elements or fallback to all sections
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // respect reduced motion
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReduced) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'none';
          } else {
            gsap.to(entry.target, { opacity: 1, y: 0, duration: TIMINGS.reveal, ease: EASE });
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    targets.forEach((t) => {
      io.observe(t);
    });
  } else {
    // fallback: animate sections on load
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('section, article').forEach((el, i) => {
      if (prefersReduced) {
        el.style.opacity = 1;
        el.style.transform = 'none';
      } else {
        gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, delay: 0.12 * i, duration: TIMINGS.reveal, ease: EASE });
      }
    });
  }

  // Smooth internal link navigation for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, { scrollTo: target, duration: 0.6, ease: 'power2.out' });
      }
    });
  });
});