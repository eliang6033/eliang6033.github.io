import {
  Bike,
  Camera,
  Crosshair,
  Film,
  Gamepad2,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { siteContent } from "../config/siteContent";
import { hobbies } from "../data/hobbies";
import type { HobbyIconName } from "../types/content";
import { SectionHeading } from "./SectionHeading";
import { SectionReveal } from "./SectionReveal";

const hobbyIcons: Record<HobbyIconName, LucideIcon> = {
  plane: Plane,
  camera: Camera,
  bike: Bike,
  target: Crosshair,
  film: Film,
  gamepad: Gamepad2,
};

export function Hobbies() {
  const content = siteContent.hobbies;

  return (
    <section className="section section--hobbies" id="hobbies">
      <SectionReveal>
        <div className="shell">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            introduction={content.introduction}
          />
          <div className="hobby-grid">
            {hobbies.map((hobby, index) => {
              const Icon = hobbyIcons[hobby.icon];
              return (
                <article
                  className={`hobby-card hobby-card--${hobby.accent}`}
                  key={hobby.title}
                >
                  <span className="hobby-card__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="hobby-card__icon">
                    <Icon aria-hidden="true" size={25} strokeWidth={1.7} />
                  </span>
                  <h3>{hobby.title}</h3>
                  <p>{hobby.description}</p>
                  <span className="hobby-card__line" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
