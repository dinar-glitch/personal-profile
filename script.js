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

  // Animated brand symbol: all artwork is inline SVG, so it never depends on third-party images.
  const rotatingSymbol = document.getElementById('rotatingSymbol');
  const symbolIcon = document.getElementById('rotatingSymbolIcon');
  const symbolCaption = document.getElementById('rotatingSymbolCaption');
  const symbolCount = document.getElementById('rotatingSymbolCount');
  if (rotatingSymbol && symbolIcon && symbolCaption && symbolCount) {
    const symbols = [
      { label: 'CREATIVE INTELLIGENCE', svg: '<svg viewBox="0 0 64 64" focusable="false"><path d="M31 12c-5-7-16-4-17 5-8 1-10 12-4 17-4 8 2 16 10 15 3 8 12 8 15 2V15c-1-1-2-2-4-3Z"/><path d="M33 12c5-7 16-4 17 5 8 1 10 12 4 17 4 8-2 16-10 15-3 8-12 8-15 2V15M19 20c5 0 8 4 7 9m-14 5c6-2 11 1 12 6m-2 8c-1-5 2-8 6-9m18-19c-5 0-8 4-7 9m14 5c-6-2-11 1-12 6m2 8c1-5-2-8-6-9"/></svg>' },
      { label: 'BRAND GROWTH', svg: '<svg viewBox="0 0 64 64" focusable="false"><path d="M8 53h48M13 46V34h10v12M28 46V25h10v21M43 46V14h10v32M11 25l15-10 11 5L52 7"/><path d="M43 7h9v9"/></svg>' },
      { label: 'INSTAGRAM CONTENT', svg: '<svg viewBox="0 0 64 64" focusable="false"><rect x="10" y="10" width="44" height="44" rx="13"/><circle cx="32" cy="32" r="10"/><circle cx="46" cy="18" r="2" fill="currentColor" stroke="none"/></svg>' },
      { label: 'ENGAGEMENT / LIKES', svg: '<svg viewBox="0 0 64 64" focusable="false"><path d="M32 53S8 39 8 23c0-8 6-13 13-13 5 0 9 3 11 8 2-5 6-8 11-8 7 0 13 5 13 13 0 16-24 30-24 30Z"/><path d="m20 31 7 7 17-18"/></svg>' },
      { label: 'SEO / DISCOVERY', svg: '<svg viewBox="0 0 64 64" focusable="false"><circle cx="27" cy="27" r="16"/><path d="m39 39 14 14M19 27h16M27 19v16"/><path d="m43 12 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z"/></svg>' }
    ];
    let symbolIndex = 0;
    function showSymbol(nextIndex) {
      symbolIndex = (nextIndex + symbols.length) % symbols.length;
      const item = symbols[symbolIndex];
      symbolIcon.classList.add('is-changing');
      window.setTimeout(() => {
        symbolIcon.innerHTML = item.svg;
        symbolCaption.textContent = item.label;
        symbolCount.textContent = `${String(symbolIndex + 1).padStart(2, '0')} / ${String(symbols.length).padStart(2, '0')}`;
        symbolIcon.classList.remove('is-changing');
        symbolIcon.style.animation = 'none';
        void symbolIcon.offsetWidth;
        symbolIcon.style.animation = reduceMotion ? 'none' : 'symbolSwap .45s ease-out';
      }, reduceMotion ? 0 : 150);
    }
    // Automatic cycling works on phones too; tapping the symbol advances it immediately.
    showSymbol(0);
    rotatingSymbol.addEventListener('click', () => showSymbol(symbolIndex + 1));
    if (!reduceMotion) {
      window.setInterval(() => {
        if (!document.hidden) showSymbol(symbolIndex + 1);
      }, 2800);
    }
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

  // Service rows lead to the inquiry form and preselect the chosen service.
  document.querySelectorAll('.service-link[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const serviceSelect = document.getElementById('inquiry-service');
      const selectedService = link.getAttribute('data-service');
      if (serviceSelect && selectedService) {
        const matchingOption = Array.from(serviceSelect.options).find(option => option.text.trim() === selectedService);
        if (matchingOption) serviceSelect.value = matchingOption.value;
        else if (selectedService === 'Social media management' || selectedService === 'Social media strategy' || selectedService === 'Instagram marketing' || selectedService === 'Graphic design' || selectedService === 'SEO') serviceSelect.value = selectedService;
      }
    });
  });

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


  // Package buttons open a choice of WhatsApp, email, or the on-page inquiry form.
  const packageModal = document.getElementById('packageContactModal');
  const packageName = document.getElementById('packageContactName');
  const packageDescription = document.getElementById('packageContactDescription');
  const packageWhatsAppLink = document.getElementById('packageWhatsAppLink');
  const packageEmailLink = document.getElementById('packageEmailLink');
  const packageFormLink = document.getElementById('packageFormLink');
  let activePackage = { name: '', price: '' };

  function closePackageModal() {
    if (!packageModal) return;
    packageModal.classList.remove('is-open');
    packageModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('package-modal-open');
  }
  document.querySelectorAll('.package-ask[data-package]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      activePackage = { name: button.dataset.package || 'Selected package', price: button.dataset.price || '' };
      if (!packageModal) return;
      if (packageName) packageName.textContent = activePackage.name + '.';
      if (packageDescription) packageDescription.textContent = `You’re asking about ${activePackage.name} (${activePackage.price} starting price). Choose how you’d like to contact Dinar.`;
      const message = `Hi Dinar, I'm interested in the ${activePackage.name} package (${activePackage.price} starting price). Could you share more details and confirm whether it's suitable for my needs?`;
      if (packageWhatsAppLink) packageWhatsAppLink.href = `https://wa.me/8801920649327?text=${encodeURIComponent(message)}`;
      if (packageEmailLink) packageEmailLink.href = `mailto:dinar375d@gmail.com?subject=${encodeURIComponent(activePackage.name + ' Package Inquiry')}&body=${encodeURIComponent(message)}`;
      if (packageFormLink) packageFormLink.href = '#project-inquiry';
      packageModal.classList.add('is-open');
      packageModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('package-modal-open');
      packageModal.querySelector('.package-contact-close')?.focus();
    });
  });
  packageModal?.querySelectorAll('[data-close-package-modal]').forEach(button => button.addEventListener('click', closePackageModal));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePackageModal(); });
  packageFormLink?.addEventListener('click', () => {
    const serviceSelect = document.getElementById('inquiry-service');
    if (serviceSelect) {
      const optionValue = activePackage.name + ' package';
      const option = Array.from(serviceSelect.options).find(item => item.text.toLowerCase() === optionValue.toLowerCase());
      if (option) serviceSelect.value = option.value;
    }
    closePackageModal();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
