import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "../config/siteContent";
import {
  internshipCategory,
  internshipEntries,
  researchCategory,
  researchEntries,
} from "../data/projects";
import type { EntryLink } from "../types/content";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { SectionHeading } from "./SectionHeading";
import { SectionReveal } from "./SectionReveal";

interface CategoryHeaderProps {
  number: string;
  label: string;
}

function CategoryHeader({ number, label }: CategoryHeaderProps) {
  return (
    <div className="project-card__top">
      <span className="project-card__number">{number}</span>
      <span className="project-card__category">{label}</span>
    </div>
  );
}

function EntryLinks({ links }: { links: EntryLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="project-entry__links">
      {links.map((link) => (
        <a
          className="project-entry__link"
          href={link.url}
          key={`${link.label}-${link.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{link.label}</span>
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      ))}
    </div>
  );
}

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
            <motion.article
              className="project-card project-card--research"
              aria-label={`${content.cardAriaPrefix} ${researchCategory.label}`}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              transition={{ duration: 0.22 }}
            >
              <CategoryHeader
                number={researchCategory.number}
                label={researchCategory.label}
              />
              <h3 className="project-card__list-title">
                {researchCategory.listTitle}
              </h3>
              <div className="project-entry-list project-entry-list--research">
                {researchEntries.length > 0 ? (
                  researchEntries.map((entry) => (
                    <article
                      className="project-entry project-entry--research"
                      key={`${entry.year}-${entry.title}`}
                    >
                      {entry.year ? (
                        <span className="project-entry__year">{entry.year}</span>
                      ) : null}
                      <h4 className="project-entry__title">{entry.title}</h4>
                      {entry.authors?.length ? (
                        <p className="project-entry__authors">
                          {entry.authors.map((author, index, authors) => (
                            <Fragment key={author.name}>
                              <span className="project-entry__author">
                                {author.highlight ? (
                                  <strong>{author.name}</strong>
                                ) : (
                                  author.name
                                )}
                                {author.marker ? <sup>{author.marker}</sup> : null}
                                {index < authors.length - 1 ? "," : null}
                              </span>
                              {index < authors.length - 1 ? " " : null}
                            </Fragment>
                          ))}
                        </p>
                      ) : null}
                      {entry.authorNote ? (
                        <p className="project-entry__author-note">
                          {entry.authorNote}
                        </p>
                      ) : null}
                      {entry.venue ? (
                        <p className="project-entry__meta">{entry.venue}</p>
                      ) : null}
                      {entry.description ? (
                        <p className="project-entry__description">
                          {entry.description}
                        </p>
                      ) : null}
                      <EntryLinks links={entry.links ?? []} />
                    </article>
                  ))
                ) : (
                  <p className="project-card__empty-state">
                    {researchCategory.emptyState}
                  </p>
                )}
              </div>
            </motion.article>

            <motion.article
              className="project-card project-card--internships"
              aria-label={`${content.cardAriaPrefix} ${internshipCategory.label}`}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              transition={{ duration: 0.22 }}
            >
              <CategoryHeader
                number={internshipCategory.number}
                label={internshipCategory.label}
              />
              <div className="project-entry-list project-entry-list--internships">
                {internshipEntries.map((entry) => (
                  <article
                    className="project-entry project-entry--internship"
                    key={`${entry.year}-${entry.role}-${entry.institution}`}
                  >
                    <span className="project-entry__year">{entry.year}</span>
                    <h3 className="project-entry__title">{entry.role}</h3>
                    <p className="project-entry__meta">{entry.institution}</p>
                    {entry.tags.length > 0 ? (
                      <ul className="tag-list">
                        {entry.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    ) : null}
                    <EntryLinks links={entry.links} />
                  </article>
                ))}
              </div>
            </motion.article>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
