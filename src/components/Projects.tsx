import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "../config/siteContent";
import { projects } from "../data/projects";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { SectionHeading } from "./SectionHeading";
import { SectionReveal } from "./SectionReveal";

export function Projects() {
  const content = siteContent.projects;
  const reduceMotion = useReducedMotionPreference();

  return (
    <section className="section section--projects" id="projects">
      <SectionReveal>
        <div className="shell">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            introduction={content.introduction}
          />
          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article
                className="project-card"
                key={project.title}
                aria-label={`${content.cardAriaPrefix} ${project.title}`}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ duration: 0.22 }}
              >
                <div className="project-card__top">
                  <span className="project-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="project-card__category">{project.category}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="tag-list">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="project-card__detail" aria-hidden="true">
                  <span>{project.detailLabel}</span>
                  <ArrowUpRight size={17} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
