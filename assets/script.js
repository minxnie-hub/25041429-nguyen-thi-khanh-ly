(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal, .assignment-card');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach((el, index) => {
      if (el.classList.contains('assignment-card')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
      }
      observer.observe(el);
    });
  } else {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  }

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('img');
    const close = lightbox.querySelector('.lightbox-close');
    let lastTrigger = null;
    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lightboxImage) lightboxImage.removeAttribute('src');
      if (lastTrigger) lastTrigger.focus();
    };
    document.querySelectorAll('.media-button, [data-lightbox]').forEach((button) => {
      const source = button.querySelector('img');
      const sourcePath = button.dataset.lightbox || source?.getAttribute('src');
      if (!sourcePath) return;

      button.setAttribute('aria-label', `Phóng to ${source?.alt || 'ảnh minh chứng'}`);
      button.addEventListener('click', () => {
        lastTrigger = button;
        if (lightboxImage) {
          lightboxImage.src = sourcePath;
          lightboxImage.alt = source?.alt || 'Ảnh minh chứng';
        }
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        close?.focus();
      });
    });
    close?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const update = () => backToTop.classList.toggle('visible', window.scrollY > 700);
    update();
    window.addEventListener('scroll', update, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const tocLinks = [...document.querySelectorAll('.toc-card a[href^="#"]')];
  const headings = tocLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (headings.length && 'IntersectionObserver' in window) {
    const tocObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
    headings.forEach((heading) => tocObserver.observe(heading));
  }
})();
