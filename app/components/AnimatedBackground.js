"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="fm-bg"
      animate={
        prefersReducedMotion
          ? { opacity: 0.72 }
          : {
              x: [0, 20, -10, 0],
              y: [0, -10, 15, 0],
              scale: [1, 1.03, 1.01, 1],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    />
  );
}
