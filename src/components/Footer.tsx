import { ArrowUp } from "lucide-react";
import { siteContent } from "../config/siteContent";

export function Footer() {
  const content = siteContent.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <p>
          © {year} {content.copyrightOwner}
        </p>
        <p>{content.builtWith}</p>
        <a href="#top">
          <span>{content.backToTop}</span>
          <ArrowUp aria-hidden="true" size={15} />
        </a>
      </div>
    </footer>
  );
}
