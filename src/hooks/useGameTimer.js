import { useState, useEffect, useRef, useCallback } from 'react';

export function useGameTimer(isRunning) {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const pausedElapsedRef = useRef(0);

  const reset = useCallback(() => {
    setElapsed(0);
    startTimeRef.current = null;
    pausedElapsedRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      pausedElapsedRef.current = elapsed;
      startTimeRef.current = null;
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - pausedElapsedRef.current * 1000;
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, elapsed]);

  return { elapsed, reset };
}
