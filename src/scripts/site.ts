document.documentElement.classList.add('js');

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = reducedMotionQuery.matches;

const siteHeader = document.querySelector<HTMLElement>('.site-header');
const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const primaryNavLinks = [...document.querySelectorAll<HTMLAnchorElement>('.site-header nav a[href^="#"]')];
const navSections = primaryNavLinks
  .map((link) => document.querySelector<HTMLElement>(link.hash))
  .filter((section): section is HTMLElement => Boolean(section));

const getSectionAnchor = (section: HTMLElement) => (
  document.querySelector<HTMLElement>(`[data-section-anchor-for="${section.id}"]`)
  ?? section.querySelector<HTMLElement>('[data-section-anchor]')
  ?? section
);

const getAnchorOffset = () => {
  const rootStyles = window.getComputedStyle(document.documentElement);
  const rem = Number.parseFloat(rootStyles.fontSize) || 16;
  const configuredOffset = Number.parseFloat(rootStyles.getPropertyValue('--site-header-anchor-height'));
  return Number.isFinite(configuredOffset) ? configuredOffset * rem : (siteHeader?.getBoundingClientRect().height ?? 0);
};

const setActiveNav = (hash?: string) => {
  primaryNavLinks.forEach((link) => {
    if (hash && link.hash === hash) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
};

const updateActiveNav = () => {
  const activationLine = getAnchorOffset() + 2;
  let activeSection: HTMLElement | undefined;

  for (const section of navSections) {
    if (getSectionAnchor(section).getBoundingClientRect().top <= activationLine) activeSection = section;
    else break;
  }

  setActiveNav(activeSection ? `#${activeSection.id}` : undefined);
};

let activeNavFrame = 0;
const queueActiveNavUpdate = () => {
  if (activeNavFrame) return;
  activeNavFrame = window.requestAnimationFrame(() => {
    activeNavFrame = 0;
    updateActiveNav();
  });
};

updateActiveNav();
window.addEventListener('scroll', queueActiveNavUpdate, { passive: true });
window.addEventListener('resize', queueActiveNavUpdate);

const getLayoutDocumentTop = (element: HTMLElement) => {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
};

const scrollToSectionHeading = (section: HTMLElement, behavior: ScrollBehavior) => {
  const anchor = getSectionAnchor(section);
  const top = getLayoutDocumentTop(anchor) - getAnchorOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
};

primaryNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.querySelector<HTMLElement>(link.hash);
    if (!section) return;

    event.preventDefault();
    setActiveNav(link.hash);
    scrollToSectionHeading(section, prefersReducedMotion ? 'auto' : 'smooth');
    window.history.pushState(null, '', link.hash);
  });
});

const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
}

const introTransition = document.querySelector<HTMLElement>('[data-intro-transition]');
if (introTransition) {
  introTransition.dataset.animationMode = 'viewport';
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    introTransition.classList.add('is-entered');
  } else {
    const introObserver = new IntersectionObserver(([entry], observer) => {
      if (!entry.isIntersecting) return;
      introTransition.classList.add('is-animating');
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => introTransition.classList.add('is-entered'));
      });
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    introObserver.observe(introTransition);
  }
}

const workflow = document.querySelector<HTMLElement>('[data-workflow]');
if (workflow) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    workflow.classList.add('is-active');
  } else {
    const workflowObserver = new IntersectionObserver(([entry], observer) => {
      if (!entry.isIntersecting) return;
      workflow.classList.add('is-active');
      observer.disconnect();
    }, { threshold: 0.35 });
    workflowObserver.observe(workflow);
  }
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  const embedButton = target.closest<HTMLButtonElement>('[data-load-embed]');
  if (embedButton) {
    const host = embedButton.closest<HTMLElement>('[data-lazy-embed]');
    const frameHost = host?.querySelector<HTMLElement>('.embed-frame');
    const status = frameHost?.querySelector<HTMLElement>('.embed-status');
    const src = host?.dataset.src;
    const kind = host?.dataset.kind ?? 'external content';
    if (!host || !frameHost || !status || !src || host.dataset.loaded === 'true') return;

    host.dataset.loaded = 'true';
    frameHost.hidden = false;
    const iframe = document.createElement('iframe');
    iframe.title = `${kind}: ${host.querySelector('h4')?.textContent ?? 'interactive content'}`;
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.allow = 'fullscreen; autoplay; xr-spatial-tracking';
    iframe.setAttribute('allowfullscreen', '');
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.addEventListener('load', () => {
      status.textContent = `${kind} loaded.`;
      status.classList.add('is-complete');
      window.setTimeout(() => status.remove(), 900);
    }, { once: true });
    const timeout = window.setTimeout(() => {
      if (!status.isConnected || status.classList.contains('is-complete')) return;
      status.innerHTML = `This ${kind.toLowerCase()} is taking longer than expected. <a href="${src}" target="_blank" rel="noreferrer">Open it in a new tab ↗</a>`;
    }, 12000);
    iframe.addEventListener('load', () => window.clearTimeout(timeout), { once: true });
    frameHost.appendChild(iframe);
    host.querySelector<HTMLElement>('.model-viewer__placeholder, .video-embed > div:not(.embed-frame)')?.setAttribute('hidden', '');
    host.querySelector<HTMLElement>('.video-embed > img')?.setAttribute('hidden', '');
  }

  const galleryButton = target.closest<HTMLButtonElement>('[data-gallery-item]');
  if (galleryButton) {
    const gallery = galleryButton.closest<HTMLElement>('[data-gallery]');
    const dialog = gallery?.querySelector<HTMLDialogElement>('dialog');
    const image = dialog?.querySelector<HTMLImageElement>('img');
    const caption = dialog?.querySelector<HTMLParagraphElement>('p');
    if (!dialog || !image || !caption) return;
    image.src = galleryButton.dataset.full ?? '';
    image.alt = galleryButton.dataset.alt ?? '';
    caption.textContent = galleryButton.dataset.caption ?? '';
    dialog.showModal();
  }

  const closeButton = target.closest<HTMLButtonElement>('[data-lightbox-close]');
  if (closeButton) closeButton.closest<HTMLDialogElement>('dialog')?.close();
});

document.querySelectorAll<HTMLDialogElement>('.lightbox').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});
