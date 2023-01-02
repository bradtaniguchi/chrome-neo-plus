import { useEffect, useState } from 'react';

/**
 * Helper hook that returns true if the component is mounted.
 *
 * Useful to prevent DOM updates on dynamic aspects of the UI.
 */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}
