import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Hobbies } from "./components/Hobbies";
import { JourneyPreview } from "./components/JourneyPreview";
import { Navbar } from "./components/Navbar";
import { Projects } from "./components/Projects";
import { JourneyLoadBoundary } from "./components/journey/JourneyLoadBoundary";
import { JourneyLoadingShell } from "./components/journey/JourneyLoadingShell";
import {
  loadJourneyMode,
  preloadJourneyExperience,
} from "./utils/preloadJourney";

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions,
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

export default function App() {
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [JourneyModeComponent, setJourneyModeComponent] = useState(() =>
    lazy(loadJourneyMode),
  );
  const openJourney = useCallback(() => {
    preloadJourneyExperience();
    setJourneyOpen(true);
  }, []);
  const closeJourney = useCallback(() => setJourneyOpen(false), []);
  const retryJourney = useCallback(() => {
    setJourneyModeComponent(lazy(loadJourneyMode));
  }, []);

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let fallbackTimer: number | undefined;

    const schedulePreload = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(
          () => preloadJourneyExperience(),
          { timeout: 5000 },
        );
        return;
      }

      fallbackTimer = window.setTimeout(preloadJourneyExperience, 1600);
    };

    if (document.readyState === "complete") {
      schedulePreload();
    } else {
      window.addEventListener("load", schedulePreload, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedulePreload);
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <>
      <div
        className={`portfolio-root ${
          journeyOpen ? "portfolio-root--journey-open" : ""
        }`}
        aria-hidden={journeyOpen || undefined}
      >
        <Navbar />
        <main>
          <Hero
            onOpenJourney={openJourney}
            onPreloadJourney={preloadJourneyExperience}
          />
          <About />
          <Projects />
          <JourneyPreview
            onOpenJourney={openJourney}
            onPreloadJourney={preloadJourneyExperience}
          />
          <Hobbies />
          <Contact />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {journeyOpen ? (
          <JourneyLoadBoundary
            onClose={closeJourney}
            onRetry={retryJourney}
          >
            <Suspense fallback={<JourneyLoadingShell onClose={closeJourney} />}>
              <JourneyModeComponent onClose={closeJourney} />
            </Suspense>
          </JourneyLoadBoundary>
        ) : null}
      </AnimatePresence>
    </>
  );
}
