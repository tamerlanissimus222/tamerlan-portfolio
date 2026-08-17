const caseRoot = document.querySelector<HTMLElement>('[data-case-section]');

if (caseRoot) {
  const tabs = [...caseRoot.querySelectorAll<HTMLButtonElement>('[data-case-select]')];
  const panels = [...caseRoot.querySelectorAll<HTMLElement>('[data-case-panel]')];
  const currentLabels = [...caseRoot.querySelectorAll<HTMLElement>('[data-case-current]')];
  const stepButtons = [...caseRoot.querySelectorAll<HTMLButtonElement>('[data-case-step]')];
  const forwardButtons = [...caseRoot.querySelectorAll<HTMLButtonElement>('[data-case-forward]')];
  const forwardLabels = [...caseRoot.querySelectorAll<HTMLElement>('[data-case-forward-label]')];
  const persistentNavigation = caseRoot.querySelector<HTMLElement>('[data-case-persistent]');
  const sideNavigation = caseRoot.querySelector<HTMLElement>('[data-case-side-navigation]');
  const caseHeader = caseRoot.querySelector<HTMLElement>('.case-section__header');
  const siteHeader = document.querySelector<HTMLElement>('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
  let caseTransitionTimer = 0;
  let caseTransitionSequence = 0;

  const clearCaseMotion = (panel: HTMLElement) => {
    panel.classList.remove('is-entering', 'is-leaving', 'is-leaving-active');
    panel.style.removeProperty('--case-enter-x');
    panel.style.removeProperty('--case-exit-x');
  };

  const settleCasePanels = (visibleIndex: number) => {
    panels.forEach((panel, index) => {
      clearCaseMotion(panel);
      panel.hidden = index !== visibleIndex;
      panel.setAttribute('aria-hidden', String(index !== visibleIndex));
    });
  };

  const currentCaseNumber = () => tabs[currentIndex]?.dataset.caseSelect ?? String(currentIndex + 1).padStart(2, '0');

  const scrollToCaseStart = () => {
    const panel = panels[currentIndex];
    if (!panel) return;
    requestAnimationFrame(() => {
      const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
      const desktopOffset = window.matchMedia('(min-width: 48.01rem)').matches
        ? (caseHeader?.getBoundingClientRect().height ?? 0) + 8
        : 8;
      const top = window.scrollY + panel.getBoundingClientRect().top - headerHeight - desktopOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  };

  const scrollToCaseSelector = () => {
    if (!caseHeader) return;
    const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
    const top = window.scrollY + caseHeader.getBoundingClientRect().top - headerHeight - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const updateNavigation = () => {
    const number = currentCaseNumber();
    currentLabels.forEach((label) => {
      label.textContent = `CASE ${number}`;
    });
    stepButtons.forEach((button) => {
      const step = Number(button.dataset.caseStep ?? 0);
      button.disabled = step < 0 ? currentIndex === 0 : currentIndex === panels.length - 1;
    });
    const onFinalCase = currentIndex === panels.length - 1;
    forwardLabels.forEach((label) => {
      label.textContent = onFinalCase ? 'All cases ↑' : 'Next case →';
    });
    forwardButtons.forEach((button) => {
      button.setAttribute('aria-label', onFinalCase ? 'Return to all case selectors' : 'Next case');
    });
  };

  const selectCase = (nextIndex: number, options: { focusTab?: boolean; resetScroll?: boolean } = {}) => {
    const { focusTab = false, resetScroll = false } = options;
    const targetIndex = Math.min(Math.max(nextIndex, 0), panels.length - 1);
    const previousIndex = currentIndex;
    const previousPanel = panels[previousIndex];
    const nextPanel = panels[targetIndex];
    const animateTransition = targetIndex !== previousIndex && !reducedMotion && Boolean(previousPanel && nextPanel && !previousPanel.hidden);
    const transitionSequence = ++caseTransitionSequence;

    if (caseTransitionTimer) {
      window.clearTimeout(caseTransitionTimer);
      caseTransitionTimer = 0;
    }
    panels.forEach((panel, index) => {
      clearCaseMotion(panel);
      panel.hidden = index !== previousIndex;
    });

    currentIndex = targetIndex;
    tabs.forEach((tab, index) => {
      const selected = index === currentIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    if (animateTransition && previousPanel && nextPanel) {
      const direction = targetIndex > previousIndex ? 1 : -1;
      previousPanel.hidden = false;
      previousPanel.setAttribute('aria-hidden', 'true');
      previousPanel.style.setProperty('--case-exit-x', `${direction * -3.5}rem`);
      previousPanel.classList.add('is-leaving');

      nextPanel.hidden = false;
      nextPanel.setAttribute('aria-hidden', 'false');
      nextPanel.style.setProperty('--case-enter-x', `${direction * 3.5}rem`);
      nextPanel.classList.add('is-entering');
      nextPanel.getBoundingClientRect();

      requestAnimationFrame(() => {
        if (transitionSequence !== caseTransitionSequence) return;
        previousPanel.classList.add('is-leaving-active');
        nextPanel.classList.remove('is-entering');
      });

      caseTransitionTimer = window.setTimeout(() => {
        if (transitionSequence !== caseTransitionSequence) return;
        previousPanel.hidden = true;
        clearCaseMotion(previousPanel);
        clearCaseMotion(nextPanel);
        caseTransitionTimer = 0;
      }, 1120);
    } else {
      settleCasePanels(currentIndex);
    }
    updateNavigation();
    requestAnimationFrame(() => updatePersistentNavigation());
    if (resetScroll) scrollToCaseStart();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCase(index, { resetScroll: true }));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : event.key === 'ArrowLeft'
            ? Math.max(0, index - 1)
            : Math.min(tabs.length - 1, index + 1);
      selectCase(nextIndex, { focusTab: true });
    });
  });

  stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectCase(currentIndex + Number(button.dataset.caseStep ?? 0), { resetScroll: true });
    });
  });

  forwardButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (currentIndex === panels.length - 1) {
        scrollToCaseSelector();
        return;
      }
      selectCase(currentIndex + 1, { resetScroll: true });
    });
  });

  selectCase(currentIndex);

  let persistentFrame = 0;
  const updatePersistentNavigation = () => {
    persistentFrame = 0;
    if (!caseHeader) return;
    const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
    const caseBounds = caseRoot.getBoundingClientRect();
    const selectorBounds = caseHeader.getBoundingClientRect();
    const navigationHeight = persistentNavigation?.getBoundingClientRect().height ?? 0;
    const isMobile = window.matchMedia('(max-width: 48rem)').matches;
    const passedSelector = selectorBounds.bottom <= headerHeight + 2;
    const caseStillVisible = caseBounds.bottom > (isMobile ? navigationHeight : headerHeight + navigationHeight);
    const persistentVisible = isMobile && passedSelector && caseStillVisible && caseBounds.top < window.innerHeight;
    persistentNavigation?.classList.toggle('is-visible', persistentVisible);
    persistentNavigation?.setAttribute('aria-hidden', String(!persistentVisible));
    caseRoot.classList.toggle('has-persistent-case-nav', persistentVisible);

    const sideVisible = !isMobile
      && caseBounds.top < window.innerHeight - 80
      && caseBounds.bottom > headerHeight + 80;
    sideNavigation?.classList.toggle('is-visible', sideVisible);
    sideNavigation?.setAttribute('aria-hidden', String(!sideVisible));
  };

  const schedulePersistentNavigation = () => {
    if (persistentFrame) return;
    persistentFrame = requestAnimationFrame(updatePersistentNavigation);
  };

  window.addEventListener('scroll', schedulePersistentNavigation, { passive: true });
  window.addEventListener('resize', schedulePersistentNavigation);
  updatePersistentNavigation();

  const boards = caseRoot.querySelectorAll<HTMLElement>('[data-case-workflow]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    boards.forEach((board) => board.classList.add('is-active'));
  } else {
    const boardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add('is-active');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    boards.forEach((board) => boardObserver.observe(board));
  }

  const carousels = caseRoot.querySelectorAll<HTMLElement>('[data-media-carousel]');
  carousels.forEach((carousel) => {
    const slides = [...carousel.querySelectorAll<HTMLButtonElement>('[data-carousel-slide]')];
    const caption = carousel.querySelector<HTMLElement>('[data-carousel-caption]');
    const counter = carousel.querySelector<HTMLElement>('[data-carousel-counter]');
    const interval = Math.max(1000, Number(carousel.dataset.carouselInterval ?? 2000));
    let currentSlide = 0;
    let timer = 0;
    let pointerInside = false;
    let focusInside = false;

    const showSlide = (nextIndex: number) => {
      currentSlide = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentSlide;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.tabIndex = active ? 0 : -1;
      });
      if (caption) caption.textContent = slides[currentSlide]?.dataset.mediaCaption ?? '';
      if (counter) counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };

    const stopCarousel = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = 0;
    };

    const startCarousel = () => {
      if (reducedMotion || slides.length < 2 || pointerInside || focusInside) return;
      stopCarousel();
      timer = window.setInterval(() => {
        const panel = carousel.closest<HTMLElement>('[data-case-panel]');
        if (document.hidden || panel?.hidden) return;
        showSlide(currentSlide + 1);
      }, interval);
    };

    carousel.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-carousel-previous]') && !target.closest('[data-carousel-next]')) return;
      const direction = target.closest('[data-carousel-previous]') ? -1 : 1;
      showSlide(currentSlide + direction);
      startCarousel();
    });
    carousel.addEventListener('pointerenter', () => {
      pointerInside = true;
      stopCarousel();
    });
    carousel.addEventListener('pointerleave', () => {
      pointerInside = false;
      startCarousel();
    });
    carousel.addEventListener('focusin', () => {
      focusInside = true;
      stopCarousel();
    });
    carousel.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && carousel.contains(event.relatedTarget)) return;
      focusInside = false;
      startCarousel();
    });

    showSlide(0);
    startCarousel();
  });

  const dialog = caseRoot.querySelector<HTMLDialogElement>('[data-case-media-dialog]');
  const dialogImage = dialog?.querySelector<HTMLImageElement>('[data-dialog-image]');
  const dialogFrame = dialog?.querySelector<HTMLIFrameElement>('[data-dialog-frame]');
  const dialogVideo = dialog?.querySelector<HTMLVideoElement>('[data-dialog-video]');
  const dialogKind = dialog?.querySelector<HTMLElement>('[data-dialog-kind]');
  const dialogCaption = dialog?.querySelector<HTMLElement>('[data-dialog-caption]');
  const dialogDescription = dialog?.querySelector<HTMLElement>('[data-dialog-description]');
  const dialogStatus = dialog?.querySelector<HTMLElement>('[data-dialog-status]');
  const dialogExternal = dialog?.querySelector<HTMLAnchorElement>('[data-dialog-external]');
  const dialogPrevious = dialog?.querySelector<HTMLButtonElement>('[data-dialog-previous]');
  const dialogNext = dialog?.querySelector<HTMLButtonElement>('[data-dialog-next]');
  const dialogCounter = dialog?.querySelector<HTMLElement>('[data-dialog-counter]');
  let dialogGalleryItems: HTMLButtonElement[] = [];
  let dialogGalleryIndex = -1;

  const updateDialogGalleryControls = () => {
    const enabled = dialogGalleryItems.length > 1 && dialogGalleryIndex >= 0;
    if (dialogPrevious) dialogPrevious.hidden = !enabled;
    if (dialogNext) dialogNext.hidden = !enabled;
    if (dialogCounter) {
      dialogCounter.hidden = !enabled;
      dialogCounter.textContent = enabled
        ? `${String(dialogGalleryIndex + 1).padStart(2, '0')} / ${String(dialogGalleryItems.length).padStart(2, '0')}`
        : '';
    }
  };

  const clearDialogMedia = () => {
    if (dialogImage) {
      dialogImage.hidden = true;
      dialogImage.removeAttribute('src');
      dialogImage.alt = '';
    }
    if (dialogFrame) {
      dialogFrame.hidden = true;
      dialogFrame.removeAttribute('src');
    }
    if (dialogVideo) {
      dialogVideo.pause();
      dialogVideo.hidden = true;
      dialogVideo.removeAttribute('src');
      dialogVideo.load();
    }
    if (dialogStatus) dialogStatus.hidden = true;
    if (dialogExternal) {
      dialogExternal.hidden = true;
      dialogExternal.removeAttribute('href');
    }
    dialog?.removeAttribute('data-loading');
  };

  const openMedia = (trigger: HTMLButtonElement) => {
    if (!dialog || !dialogImage || !dialogFrame || !dialogVideo || !dialogKind || !dialogCaption || !dialogDescription || !dialogStatus || !dialogExternal) return;
    clearDialogMedia();
    const type = trigger.dataset.mediaType ?? 'image';
    const source = trigger.dataset.mediaSrc ?? '';
    const caption = trigger.dataset.mediaCaption ?? 'Case evidence';
    const alt = trigger.dataset.mediaAlt ?? '';
    const mediaGroup = trigger.dataset.mediaGroup;
    if (mediaGroup) {
      dialogGalleryItems = [...caseRoot.querySelectorAll<HTMLButtonElement>(`[data-media-group="${CSS.escape(mediaGroup)}"]`)];
      dialogGalleryIndex = Math.max(0, dialogGalleryItems.indexOf(trigger));
    } else {
      dialogGalleryItems = [];
      dialogGalleryIndex = -1;
    }
    dialog.dataset.mediaType = type;
    dialogKind.textContent = type === 'image' ? 'PHOTO EVIDENCE' : type === 'model3d' ? 'INTERACTIVE 3D EVIDENCE' : 'VIDEO EVIDENCE';
    dialogCaption.textContent = caption;
    dialogDescription.textContent = alt;

    if (type === 'image') {
      dialogImage.src = source;
      dialogImage.alt = alt;
      dialogImage.hidden = false;
    } else if (type === 'localVideo') {
      dialogVideo.src = source;
      dialogVideo.hidden = false;
    } else {
      dialog.dataset.loading = 'true';
      dialogStatus.hidden = false;
      dialogFrame.src = source;
      dialogFrame.hidden = false;
      dialogFrame.addEventListener('load', () => {
        dialogStatus.hidden = true;
        dialog.removeAttribute('data-loading');
      }, { once: true });
      dialogExternal.href = source;
      dialogExternal.hidden = false;
    }
    updateDialogGalleryControls();
    if (!dialog.open) dialog.showModal();
  };

  const stepDialogGallery = (direction: number) => {
    if (dialogGalleryItems.length < 2 || dialogGalleryIndex < 0) return;
    dialogGalleryIndex = (dialogGalleryIndex + direction + dialogGalleryItems.length) % dialogGalleryItems.length;
    openMedia(dialogGalleryItems[dialogGalleryIndex]);
  };

  caseRoot.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const expandButton = target.closest<HTMLButtonElement>('[data-stage-expand]');
    if (expandButton) {
      const stage = expandButton.closest<HTMLElement>('[data-workflow-stage]');
      if (!stage) return;
      const expanded = stage.classList.toggle('is-expanded');
      expandButton.setAttribute('aria-expanded', String(expanded));
      expandButton.innerHTML = expanded
        ? `<strong>−</strong><span>${expandButton.dataset.lessLabel ?? 'Show less'}</span>`
        : `<strong>${(expandButton.dataset.moreLabel ?? '+ View stage').split(' / ')[0]}</strong><span>${(expandButton.dataset.moreLabel ?? '+ View stage').split(' / ')[1] ?? 'View stage'}</span>`;
      return;
    }

    const mediaButton = target.closest<HTMLButtonElement>('[data-case-media-open]');
    if (mediaButton) {
      openMedia(mediaButton);
      return;
    }

    const dialogPreviousButton = target.closest<HTMLButtonElement>('[data-dialog-previous]');
    if (dialogPreviousButton) {
      stepDialogGallery(-1);
      return;
    }

    const dialogNextButton = target.closest<HTMLButtonElement>('[data-dialog-next]');
    if (dialogNextButton) {
      stepDialogGallery(1);
      return;
    }

    const closeButton = target.closest<HTMLButtonElement>('[data-case-dialog-close]');
    if (closeButton) {
      clearDialogMedia();
      dialog?.close();
    }
  });

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (dialogGalleryItems.length < 2) return;
    event.preventDefault();
    stepDialogGallery(event.key === 'ArrowLeft' ? -1 : 1);
  });
  dialog?.addEventListener('close', () => {
    clearDialogMedia();
    dialogGalleryItems = [];
    dialogGalleryIndex = -1;
    updateDialogGalleryControls();
  });
}
