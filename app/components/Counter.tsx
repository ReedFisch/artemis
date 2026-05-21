"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  from?: number;
  to: number;
  duration?: number; // in seconds
  format?: (val: number) => string;
}

export default function Counter({ from = 0, to, duration = 2, format }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let start = performance.now();
    
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(from + (to - from) * easeProgress);
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };

    requestAnimationFrame(tick);
  }, [from, to, duration, isInView]);

  return (
    <span ref={ref}>
      {format ? format(value) : value}
    </span>
  );
}
