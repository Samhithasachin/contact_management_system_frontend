import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function useCountUp(value, { duration = 0.6 } = {}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = to;
    return () => controls.stop();
  }, [value, duration]);

  return display;
}
