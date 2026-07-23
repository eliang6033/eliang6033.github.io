import {
  FileText,
  Github,
  Linkedin,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { socialLinks, uiStatusText } from "../config/siteContent";
import type { SocialIconName } from "../types/content";
import { isPlaceholderLink } from "../utils/links";

const socialIcons: Record<SocialIconName, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  resume: FileText,
};

interface SocialLinksProps {
  variant?: "compact" | "buttons";
  ariaLabel?: string;
}

export function SocialLinks({
  variant = "compact",
  ariaLabel,
}: SocialLinksProps) {
  return (
    <div
      className={`social-links social-links--${variant}`}
      aria-label={ariaLabel}
    >
      {socialLinks.map((link) => {
        const Icon = socialIcons[link.icon];
        const placeholder = isPlaceholderLink(link.href);

        if (placeholder) {
          return (
            <span
              className="social-link social-link--placeholder"
              key={link.label}
              title={uiStatusText.linkPlaceholder}
              aria-label={`${link.label}: ${uiStatusText.unavailableLink}`}
            >
              <Icon aria-hidden="true" size={variant === "compact" ? 17 : 19} />
              <span>{link.label}</span>
            </span>
          );
        }

        return (
          <a
            className="social-link"
            href={link.href}
            key={link.label}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            <Icon aria-hidden="true" size={variant === "compact" ? 17 : 19} />
            <span>{link.label}</span>
          </a>
        );
      })}
    </div>
  );
}
