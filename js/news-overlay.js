document.addEventListener('DOMContentLoaded', () => {

  const carousel = document.querySelector('#carouselExampleIndicators');

  if (carousel) {
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const carouselController = window.jQuery?.(carousel);
    const pauseDuration = 15000;
    let resumeTimer;
    let isTemporarilyPaused = false;

    const updateCarouselControls = () => {
      carouselItems.forEach((item) => {
        item.setAttribute('aria-pressed', String(isTemporarilyPaused));
        item.setAttribute(
          'aria-label',
          isTemporarilyPaused
            ? 'Resume the news carousel and show captions'
            : 'Pause the news carousel and hide captions',
        );
      });
    };

    const resumeCarousel = () => {
      clearTimeout(resumeTimer);
      isTemporarilyPaused = false;
      carousel.classList.remove('news-captions-hidden');
      carouselController?.carousel('cycle');
      updateCarouselControls();
    };

    const pauseCarousel = () => {
      clearTimeout(resumeTimer);
      isTemporarilyPaused = true;
      carousel.classList.add('news-captions-hidden');
      carouselController?.carousel('pause');
      updateCarouselControls();
      resumeTimer = window.setTimeout(resumeCarousel, pauseDuration);
    };

    carouselItems.forEach((item) => {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const toggleCarousel = () => {
        if (isTemporarilyPaused) {
          resumeCarousel();
        } else {
          pauseCarousel();
        }
      };

      item.addEventListener('click', toggleCarousel);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleCarousel();
        }
      });
    });

    carouselController?.on('slide.bs.carousel', resumeCarousel);
    updateCarouselControls();
  }

  const interestRow = document.querySelector('#interest .row');
  const interestItems = document.querySelectorAll('#interest .portfolio-item');
  let activeInterestItem;

  const closeInterestPreview = () => {
    if (!activeInterestItem) {
      return;
    }

    activeInterestItem.classList.remove('interest-preview-active');
    activeInterestItem.style.removeProperty('--interest-preview-scale');
    activeInterestItem.style.removeProperty('--interest-preview-shift-x');
    activeInterestItem.setAttribute('aria-pressed', 'false');
    const title = activeInterestItem.querySelector('h5')?.textContent?.trim() || 'research interest';
    activeInterestItem.setAttribute('aria-label', `Expand the ${title} preview`);
    const closingItem = activeInterestItem;
    window.setTimeout(() => {
      if (!closingItem.classList.contains('interest-preview-active')) {
        closingItem.closest('article')?.classList.remove('interest-preview-host');
      }
    }, 400);
    interestRow?.classList.remove('interest-preview-open');
    activeInterestItem = undefined;
  };

  const openInterestPreview = (item) => {
    closeInterestPreview();

    const title = item.querySelector('h5')?.textContent?.trim() || 'research interest';
    const rowBounds = interestRow?.getBoundingClientRect();
    const itemBounds = item.getBoundingClientRect();
    const horizontalPadding = 24;
    const maxScale = rowBounds
      ? Math.min(1.7, (rowBounds.width - horizontalPadding * 2) / itemBounds.width)
      : 1.7;
    const scale = Math.max(1, maxScale);
    const scaledWidth = itemBounds.width * scale;
    const scaledLeft = itemBounds.left - (scaledWidth - itemBounds.width) / 2;
    const scaledRight = itemBounds.right + (scaledWidth - itemBounds.width) / 2;
    const minShift = rowBounds ? rowBounds.left + horizontalPadding - scaledLeft : 0;
    const maxShift = rowBounds ? rowBounds.right - horizontalPadding - scaledRight : 0;
    const shiftX = minShift > 0 ? minShift : maxShift < 0 ? maxShift : 0;

    item.style.setProperty('--interest-preview-scale', scale.toFixed(2));
    item.style.setProperty('--interest-preview-shift-x', `${shiftX.toFixed(0)}px`);
    item.classList.add('interest-preview-active');
    item.setAttribute('aria-pressed', 'true');
    item.setAttribute('aria-label', `Restore the ${title} preview`);
    item.closest('article')?.classList.add('interest-preview-host');
    interestRow?.classList.add('interest-preview-open');
    activeInterestItem = item;
  };

  interestItems.forEach((item) => {
    const title = item.querySelector('h5')?.textContent?.trim() || 'research interest';
    item.setAttribute('aria-label', `Expand the ${title} preview`);
    item.setAttribute('aria-pressed', 'false');
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const toggleInterestPreview = () => {
      if (activeInterestItem === item) {
        closeInterestPreview();
      } else {
        openInterestPreview(item);
      }
    };

    item.addEventListener('click', toggleInterestPreview);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleInterestPreview();
      }
    });
    item.addEventListener('mouseleave', () => {
      if (activeInterestItem === item) {
        closeInterestPreview();
      }
    });
  });

  const videos = document.querySelectorAll('#interest .interest-video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let videoObserver;

  const pauseAll = () => videos.forEach((video) => video.pause());
  const updateVideoPlayback = () => {
    videoObserver?.disconnect();

    if (reducedMotion.matches) {
      pauseAll();
      return;
    }

    videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          target.play().catch(() => {});
        } else {
          target.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach((video) => videoObserver.observe(video));
  };

  updateVideoPlayback();
  reducedMotion.addEventListener?.('change', updateVideoPlayback);
});
