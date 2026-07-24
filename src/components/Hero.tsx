import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { siteContent } from "../config/siteContent";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { SocialLinks } from "./SocialLinks";

interface HeroProps {
  onOpenJourney: () => void;
  onPreloadJourney: () => void;
}

export function Hero({ onOpenJourney, onPreloadJourney }: HeroProps) {
  const content = siteContent.hero;
  const parentheticalStart = content.name.indexOf("(");
  const nameLines =
    parentheticalStart > 0
      ? [
          content.name.slice(0, parentheticalStart),
          content.name.slice(parentheticalStart),
        ]
      : [content.name];
  const reduceMotion = useReducedMotionPreference();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 22 });
  const y = useSpring(rawY, { stiffness: 90, damping: 22 });

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
    rawY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 18);
  };

  const resetPointer = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section className="hero shell" id="top" aria-labelledby="hero-title">
      <motion.div
        className="hero-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="hero-eyebrow">{content.eyebrow}</p>
        <h1 id="hero-title" aria-label={content.name}>
          {nameLines.map((line) => (
            <span className="hero-name-line" key={line} aria-hidden="true">
              {line}
            </span>
          ))}
        </h1>
        <p className="hero-degree">{content.degrees}</p>
        <p className="hero-school">{content.school}</p>
        <p className="hero-intro">{content.introduction}</p>

        <div className="hero-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={onOpenJourney}
            onPointerEnter={onPreloadJourney}
            onFocus={onPreloadJourney}
          >
            <span>{content.primaryAction}</span>
            <ArrowRight aria-hidden="true" size={18} />
          </button>
          <a className="button button--secondary" href="#projects">
            <span>{content.secondaryAction}</span>
            <ArrowDownRight aria-hidden="true" size={18} />
          </a>
        </div>

        <SocialLinks />
      </motion.div>

      <motion.div
        className="hero-visual"
        aria-label={content.visualLabel}
        onMouseMove={handlePointerMove}
        onMouseLeave={resetPointer}
        style={{ x, y }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.12 }}
      >
        <div className="hero-visual__grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--outer" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--inner" aria-hidden="true" />
        <div className="hero-core">
          <span className="hero-core__dot" aria-hidden="true" />
          <span>{content.visualCenterLabel}</span>
        </div>
        {content.visualNodes.map((label, index) => (
          <span className={`hero-node hero-node--${index + 1}`} key={label}>
            <i aria-hidden="true" />
            {label}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
