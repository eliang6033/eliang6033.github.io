import {
  Bike,
  Camera,
  Crosshair,
  Feather,
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
  feather: Feather,
  film: Film,
  gamepad: Gamepad2,
};

export function Hobbies() {
  const content = siteContent.hobbies;

  return (
    <section className="section section--hobbies" id="hobbies">
      <SectionReveal>
        <div className="shell">
          <SectionHeading eyebrow={content.eyebrow} title={content.title} />
          <ul className="hobby-list" role="list">
            {hobbies.map((hobby) => {
              const Icon = hobbyIcons[hobby.icon];
              return (
                <li
                  className={`hobby-item hobby-item--${hobby.accent}`}
                  key={hobby.title}
                >
                  <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
                  <span>{hobby.title}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </SectionReveal>
    </section>
  );
}
