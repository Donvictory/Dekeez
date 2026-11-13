document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation hamburger morph and modal toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const lineTop = document.getElementById('line-top');
  const lineBottom = document.getElementById('line-bottom');
  const navLinks = document.querySelectorAll('.mobile-nav-link');
  let isMenuOpen = false;

  function toggleMenu(open) {
    isMenuOpen = typeof open === 'boolean' ? open : !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.remove('pointer-events-none', 'opacity-0');
      mobileMenu.classList.add('pointer-events-auto', 'opacity-100');
      lineTop.classList.add('rotate-45', 'translate-y-1.5');
      lineBottom.classList.add('-rotate-45', '-translate-y-1.5');
      document.body.style.overflow = 'hidden';

      // Staggered reveal for nav items
      navLinks.forEach((link, idx) => {
        link.style.transitionDelay = `${100 + idx * 60}ms`;
        link.classList.remove('translate-y-8', 'opacity-0');
        link.classList.add('translate-y-0', 'opacity-100');
      });
    } else {
      mobileMenu.classList.remove('pointer-events-auto', 'opacity-100');
      mobileMenu.classList.add('pointer-events-none', 'opacity-0');
      lineTop.classList.remove('rotate-45', 'translate-y-1.5');
      lineBottom.classList.remove('-rotate-45', '-translate-y-1.5');
      document.body.style.overflow = '';

      navLinks.forEach((link) => {
        link.style.transitionDelay = '0ms';
        link.classList.remove('translate-y-0', 'opacity-100');
        link.classList.add('translate-y-8', 'opacity-0');
      });
    }
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => toggleMenu());
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // Active section indicator in navigation
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-white', 'bg-white/10');
            link.classList.remove('text-[#9B9B9B]');
          } else {
            link.classList.remove('text-white', 'bg-white/10');
            link.classList.add('text-[#9B9B9B]');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Tagline word by word reveal on scroll (B11)
  const taglineEl = document.getElementById('tagline-reveal-text');
  if (taglineEl) {
    const originalText = taglineEl.innerText.trim();
    const words = originalText.split(/\s+/);
    taglineEl.innerHTML = words.map(w => `<span class="tagline-word inline-block transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] text-white/30 mr-[0.3em]">${w}</span>`).join('');

    const wordSpans = taglineEl.querySelectorAll('.tagline-word');
    const taglineSection = document.getElementById('tagline-section');

    function checkTaglineScroll() {
      if (!taglineSection) return;
      const rect = taglineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the section has traversed through the viewport center
      const startPoint = windowHeight * 0.85;
      const endPoint = windowHeight * 0.2;
      const progress = Math.min(Math.max((startPoint - rect.top) / (startPoint - endPoint), 0), 1);
      
      const wordsToLight = Math.floor(progress * wordSpans.length);
      wordSpans.forEach((span, idx) => {
        if (idx <= wordsToLight) {
          span.classList.remove('text-white/30');
          span.classList.add('text-white');
        } else {
          span.classList.remove('text-white');
          span.classList.add('text-white/30');
        }
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkTaglineScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    checkTaglineScroll();
  }

  // Viewport scroll interpolation (B7) using IntersectionObserver
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('translate-y-16', 'blur-md', 'opacity-0');
          entry.target.classList.add('translate-y-0', 'blur-0', 'opacity-100');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => {
      el.classList.remove('translate-y-16', 'blur-md', 'opacity-0');
      el.classList.add('translate-y-0', 'blur-0', 'opacity-100');
    });
  }

  // FAQ Accordion logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        
        // Close other FAQs
        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.classList.remove('rotate-180');
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });

  // Booking Form to WhatsApp Redirect Builder
  const bookingForm = document.getElementById('booking-inquiry-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('client-name')?.value.trim() || 'Valued Client';
      const service = document.getElementById('service-type')?.value || 'Bridal Glam';
      const date = document.getElementById('event-date')?.value || 'Upcoming Date';
      const city = document.getElementById('event-location')?.value || 'Lagos';
      const guests = document.getElementById('guest-count')?.value || '1';
      const notes = document.getElementById('client-notes')?.value.trim() || 'No special requests';

      const message = `Hello Dekeez Beauty, my name is ${name}. I would like to book a makeup session for ${service}. Event date: ${date}. Location: ${city}. Number of faces: ${guests}. Details: ${notes}. Please let me know your availability.`;

      const encoded = encodeURIComponent(message);
      // Nigerian WhatsApp international format (sample verified business line for Dekeez Beauty)
      const whatsappUrl = `https://wa.me/2347080858595?text=${encoded}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});

