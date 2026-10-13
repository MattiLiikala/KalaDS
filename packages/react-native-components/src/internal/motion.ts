import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Whether the user prefers reduced motion (prefers-reduced-motion on the web). */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}
