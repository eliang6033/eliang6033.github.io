import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";

export function SectionReveal({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotionPreference();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
