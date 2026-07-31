"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCounterProps {
  /** The number to count up to */
  value: number;
  /** Text appended after the number, e.g. "+ Countries" */
  suffix?: string;
  /** Text prepended before the number, e.g. "$" */
  prefix?: string;
  /** How long the count-up animation takes, in seconds */
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });
    return controls.stop;
  }, [isInView, value, duration, count]);

  return (
    <p ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </p>
  );
}
