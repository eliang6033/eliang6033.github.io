import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteContent } from "../config/siteContent";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotionPreference();
  const content = siteContent.navigation;

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <a className="nav-brand" href="#top" onClick={() => setMenuOpen(false)}>
          <span className="nav-brand__mark" aria-hidden="true">
            {content.brandMark}
          </span>
          <span>{content.brand}</span>
        </a>

        <nav className="nav-links nav-links--desktop" aria-label={content.menuLabel}>
          {content.items.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={toggle}
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? content.closeMenuLabel : content.openMenuLabel}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-navigation"
            className="nav-links nav-links--mobile"
            aria-label={content.menuLabel}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {content.items.map((item) => (
              <a
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
