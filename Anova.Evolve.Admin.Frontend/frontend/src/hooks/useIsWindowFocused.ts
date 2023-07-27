// This hook was built revolving around the same idea from this post:
// https://stackoverflow.com/a/15846434/7752479
import { useCallback, useEffect, useState } from 'react';

interface InViewMapping {
  focus: 1;
  pageshow: 1;
  [key: string]: number | undefined;
}

const inViewMapping: InViewMapping = { focus: 1, pageshow: 1 };

function useIsWindowFocused() {
  const [inView, setInView] = useState(false);

  const handleVisibilityChange = useCallback(
    (e: FocusEvent | PageTransitionEvent) => {
      if (inViewMapping[e.type]) {
        if (inView) {
          return;
        }
        setInView(true);
      } else if (inView) {
        setInView(false);
      }
    },
    [inView, setInView]
  );

  useEffect(() => {
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);
    window.addEventListener('pageshow', handleVisibilityChange);
    window.addEventListener('pagehide', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('pageshow', handleVisibilityChange);
      window.removeEventListener('pagehide', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return inView;
}

export default useIsWindowFocused;
