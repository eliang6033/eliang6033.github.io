import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { siteContent, themeTokens } from "./config/siteContent";
import "./styles/globals.css";

document.title = siteContent.seo.title;
Object.entries(themeTokens.colors).forEach(([name, value]) => {
  document.documentElement.style.setProperty(`--color-${name}`, value);
});

const description = document.querySelector<HTMLMetaElement>(
  'meta[name="description"]',
);
if (description) description.content = siteContent.seo.description;

const socialTitle = document.querySelector<HTMLMetaElement>(
  'meta[property="og:title"]',
);
if (socialTitle) socialTitle.content = siteContent.seo.socialTitle;

const socialDescription = document.querySelector<HTMLMetaElement>(
  'meta[property="og:description"]',
);
if (socialDescription) {
  socialDescription.content = siteContent.seo.socialDescription;
}

const socialImageUrl = new URL(siteContent.seo.socialImage, window.location.href).href;
const socialImage = document.querySelector<HTMLMetaElement>(
  'meta[property="og:image"]',
);
if (socialImage) socialImage.content = socialImageUrl;

const twitterCard = document.querySelector<HTMLMetaElement>(
  'meta[name="twitter:card"]',
);
if (twitterCard) twitterCard.content = siteContent.seo.twitterCard;

const twitterTitle = document.querySelector<HTMLMetaElement>(
  'meta[name="twitter:title"]',
);
if (twitterTitle) twitterTitle.content = siteContent.seo.socialTitle;

const twitterDescription = document.querySelector<HTMLMetaElement>(
  'meta[name="twitter:description"]',
);
if (twitterDescription) {
  twitterDescription.content = siteContent.seo.socialDescription;
}

const twitterImage = document.querySelector<HTMLMetaElement>(
  'meta[name="twitter:image"]',
);
if (twitterImage) twitterImage.content = socialImageUrl;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
