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
    carousel.querySelectorAll('.carousel-item').forEach((item) => {
      makeToggleable(item, 'news-overlay-pinned', 'Toggle the news caption');
    });
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
