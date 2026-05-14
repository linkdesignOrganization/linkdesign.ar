const BODY_COLOR_CLASS_PREFIX = 'color-';

function removeBodyColorClasses(body: HTMLElement) {
  const classesToRemove = Array.from(body.classList).filter((className) =>
    className.startsWith(BODY_COLOR_CLASS_PREFIX)
  );

  if (classesToRemove.length > 0) {
    body.classList.remove(...classesToRemove);
  }
}

export function initScrollPanelColors(root: ParentNode): (() => void) | undefined {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined;
  }

  const panels = Array.from(root.querySelectorAll<HTMLElement>('.panel[data-color]'));
  if (panels.length === 0) {
    return undefined;
  }

  const body = document.body;

  const updateBodyColor = () => {
    const scrollMarker = window.scrollY + window.innerHeight / 3;
    let activeColor: string | null = null;

    for (const panel of panels) {
      const rect = panel.getBoundingClientRect();
      const panelTop = rect.top + window.scrollY;
      const panelBottom = panelTop + rect.height;

      if (panelTop <= scrollMarker && panelBottom > scrollMarker) {
        activeColor = panel.dataset['color'] ?? null;
        break;
      }
    }

    removeBodyColorClasses(body);
    if (activeColor) {
      body.classList.add(`${BODY_COLOR_CLASS_PREFIX}${activeColor}`);
    }
  };

  const updateOnNextFrame = () => window.requestAnimationFrame(updateBodyColor);

  window.addEventListener('scroll', updateBodyColor, { passive: true });
  window.addEventListener('resize', updateBodyColor);
  window.addEventListener('load', updateOnNextFrame);

  updateOnNextFrame();
  window.setTimeout(updateBodyColor, 250);

  return () => {
    window.removeEventListener('scroll', updateBodyColor);
    window.removeEventListener('resize', updateBodyColor);
    window.removeEventListener('load', updateOnNextFrame);
    removeBodyColorClasses(body);
  };
}
