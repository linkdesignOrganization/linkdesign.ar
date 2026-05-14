export function initDeferredVideoObserver(root: ParentNode): (() => void) | undefined {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return undefined;
  }

  const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('video[data-deferred-video]'));
  if (videos.length === 0) {
    return undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          if (!video.dataset['loaded']) {
            video.preload = 'metadata';
            video.load();
            video.dataset['loaded'] = 'true';
          }
          video.play().catch(() => undefined);
          return;
        }

        video.pause();
      });
    },
    {
      root: null,
      rootMargin: '160px 0px',
      threshold: 0.15
    }
  );

  videos.forEach((video) => observer.observe(video));

  return () => observer.disconnect();
}
