import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useState } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Hobbies } from "./components/Hobbies";
import { JourneyPreview } from "./components/JourneyPreview";
import { Navbar } from "./components/Navbar";
import { Projects } from "./components/Projects";
import { siteContent, uiStatusText } from "./config/siteContent";

const JourneyMode = lazy(
  () => import("./components/journey/JourneyMode"),
);

export default function App() {
  const [journeyOpen, setJourneyOpen] = useState(false);
  const openJourney = useCallback(() => setJourneyOpen(true), []);
  const closeJourney = useCallback(() => setJourneyOpen(false), []);

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
          <Hero onOpenJourney={openJourney} />
          <About />
          <Projects />
          <JourneyPreview onOpenJourney={openJourney} />
          <Hobbies />
          <Contact />
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {journeyOpen ? (
          <Suspense
            fallback={
              <div
                className="journey-mode journey-mode--loading"
                role="status"
                aria-label={siteContent.journeyMode.ariaLabel}
              >
                <span aria-hidden="true" />
                <p>{uiStatusText.loadingJourney}</p>
              </div>
            }
          >
            <JourneyMode onClose={closeJourney} />
          </Suspense>
        ) : null}
      </AnimatePresence>
    </>
  );
}
