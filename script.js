(() => {
  const loader = document.querySelector('.loader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('done'), reduceMotion ? 0 : 850);
  });
  window.setTimeout(() => loader?.classList.add('done'), 2500);

  // Reveal elements as they enter the viewport.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -25px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Mobile navigation.
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    nav?.classList.toggle('open', !open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }));

  // Persistent light/dark theme toggle.
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('dinar-verse-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark-mode');
  function updateThemeButton() {
    const dark = document.body.classList.contains('dark-mode');
    if (themeToggle) {
      themeToggle.innerHTML = dark ? '<span class="theme-icon">☼</span>' : '<span class="theme-icon">◐</span>';
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
  updateThemeButton();
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dinar-verse-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeButton();
  });

  // Desktop custom cursor, disabled for touch and reduced-motion users.
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion && dot && ring) {
    let x = -100, y = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      dot.style.opacity = ring.style.opacity = '1';
      dot.style.left = `${x}px`; dot.style.top = `${y}px`;
    });
    const moveRing = () => {
      rx += (x - rx) * .18; ry += (y - ry) * .18;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(moveRing);
    };
    moveRing();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // Gentle cursor parallax on the abstract brain illustration.
  const art = document.querySelector('.hero-art');
  const brain = document.querySelector('.brain-svg');
  if (art && brain && finePointer && !reduceMotion) {
    art.addEventListener('mousemove', e => {
      const r = art.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      brain.style.transform = `rotateY(${px * 9}deg) rotateX(${-py * 8}deg) translate(${px * 5}px, ${py * 5}px)`;
    });
    art.addEventListener('mouseleave', () => { brain.style.transform = ''; });
  }

  // Small magnetic pull on CTA buttons (desktop only).
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - r.left - r.width / 2;
        const dy = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${dx * .08}px, ${dy * .12}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // Project inquiry: prepare a message for email or WhatsApp (static GitHub Pages has no form backend).
  const inquiryForm = document.getElementById('projectInquiryForm');
  const inquiryWhatsApp = document.getElementById('inquiryWhatsApp');
  const inquiryStatus = document.getElementById('inquiryStatus');
  function getInquiryMessage() {
    if (!inquiryForm) return '';
    const data = new FormData(inquiryForm);
    return [
      'Hello Dinar, I would like to discuss a project.',
      '',
      `Name: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Business / brand: ${data.get('company') || 'Not provided'}`,
      `Service: ${data.get('service') || ''}`,
      `Estimated budget: ${data.get('budget') || ''}`,
      `Preferred start: ${data.get('timing') || 'Not specified'}`,
      '',
      'Project details:',
      data.get('details') || ''
    ].join('\n');
  }
  function validateInquiry() {
    if (!inquiryForm || !inquiryForm.reportValidity()) return false;
    return true;
  }
  inquiryForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateInquiry()) return;
    const subject = `Project Inquiry — ${inquiryForm.elements.name.value.trim()}`;
    const mailto = `mailto:dinar375d@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getInquiryMessage())}`;
    if (inquiryStatus) inquiryStatus.textContent = 'Your email app should open with the inquiry prepared. Please review it and press Send. If nothing opens, use the WhatsApp option.';
    window.location.href = mailto;
  });
  inquiryWhatsApp?.addEventListener('click', () => {
    if (!validateInquiry()) return;
    const url = `https://wa.me/8801920649327?text=${encodeURIComponent(getInquiryMessage())}`;
    if (inquiryStatus) inquiryStatus.textContent = 'WhatsApp will open with your inquiry prepared. Review the message and press Send.';
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
