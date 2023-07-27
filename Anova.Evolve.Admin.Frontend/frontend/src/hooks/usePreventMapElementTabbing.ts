import { useEffect } from 'react';

export const usePreventMapElementTabbing = () => {
  // Prevent tabbing onto form-specific elements. Note that some form elements
  // may take time to appear which is why a setTimeout is used.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const tabbableElementSelectors = [
        '.mapboxgl-map a',
        '.mapboxgl-ctrl button',
        '.mapboxgl-canvas',
        '.mapbox-wrapper > div',
      ];
      const elements = document.querySelectorAll(
        tabbableElementSelectors.join(', ')
      );
      elements.forEach((element) => element.setAttribute('tabindex', '-1'));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);
};
