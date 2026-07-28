document.addEventListener('DOMContentLoaded', () => {
  const togglePressedState = (element, className) => {
    const isPinned = element.classList.toggle(className);
    element.setAttribute('aria-pressed', String(isPinned));
  };

  const makeToggleable = (element, className, label) => {
    element.setAttribute('aria-label', label);
    element.setAttribute('aria-pressed', 'false');
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');

    const toggle = () => togglePressedState(element, className);

    element.addEventListener('click', toggle);
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  };

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

  document.querySelectorAll('#interest .portfolio-item').forEach((item) => {
    const title = item.querySelector('h5')?.textContent?.trim() || 'research interest';
    makeToggleable(item, 'interest-overlay-pinned', `Toggle the ${title} title`);
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
