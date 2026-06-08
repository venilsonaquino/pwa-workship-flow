import { useState, useEffect } from 'react';

export type DeviceOrientation = 'portrait' | 'landscape';

/**
 * useDeviceOrientation
 * Returns the current screen orientation for responsive mobile layouts.
 */
export function useDeviceOrientation(): DeviceOrientation {
  const getOrientation = (): DeviceOrientation => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape';
  };

  const [orientation, setOrientation] = useState<DeviceOrientation>(getOrientation);

  useEffect(() => {
    const handleResize = () => setOrientation(getOrientation());

    window.addEventListener('resize', handleResize);
    screen.orientation?.addEventListener?.('change', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      screen.orientation?.removeEventListener?.('change', handleResize);
    };
  }, []);

  return orientation;
}
