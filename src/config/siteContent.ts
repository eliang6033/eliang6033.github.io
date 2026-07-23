import type { SocialLink } from "../types/content";

export const siteContent = {
  seo: {
    title: "Qifeng(Eli) Liang — Research & Journey",
    description:
      "Qifeng(Eli) Liang is a Mathematics–Computer Science and Cognitive Science student exploring AI, robotics, embodied intelligence, and the real world.",
    socialTitle: "Qifeng(Eli) Liang — Research & Journey",
    socialDescription:
      "A researcher exploring intelligent systems and the real world—one project and one journey at a time.",
    socialImage: "/og-v2.png",
    twitterCard: "summary_large_image",
  },
  navigation: {
    brand: "Qifeng(Eli) Liang",
    brandMark: "E",
    menuLabel: "Main navigation",
    openMenuLabel: "Open navigation menu",
    closeMenuLabel: "Close navigation menu",
    items: [
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Journey", href: "#journey" },
      { label: "Hobbies", href: "#hobbies" },
      { label: "Contact", href: "#contact" },
    ],
  },
  hero: {
    eyebrow: "Researcher · Builder · Explorer",
    name: "Qifeng(Eli) Liang",
    degrees: "Mathematics–Computer Science & Cognitive Science",
    school: "University of California San Diego",
    introduction:
      "I study artificial intelligence, robotics, and world models, with a focus on how intelligent systems learn to understand and interact with the physical world.",
    primaryAction: "Explore My Journey",
    secondaryAction: "View My Work",
    visualLabel: "Ideas in motion",
    visualCenterLabel: "Intelligence",
    visualNodes: ["AI", "Robotics", "World Models", "Travel"],
  },
  about: {
    eyebrow: "01 · About",
    title: "About Me",
    paragraphs: [
      "I currently study Mathematics–Computer Science and Cognitive Science at UC San Diego. My interests sit at the intersection of artificial intelligence, robotics, embodied intelligence, and world models.",
      "I enjoy traveling, photography, mountain biking, clay target shooting, gaming, sci-fi movies, and experiencing different cultures. This space connects my academic work with my exploration of the physical world.",
    ],
    facts: {
      location: {
        value: "San Diego, CA",
        label: "Based at UC San Diego",
      },
      focus: {
        value: "AI + Robotics",
        label: "Research focus",
      },
      countries: {
        label: "Countries and counting",
      },
    },
  },
  projects: {
    eyebrow: "02 · Research & Projects",
    title: "Questions worth building toward.",
    introduction:
      "I am interested in systems that can reason about the physical world, act safely within it, and keep learning from experience.",
    cardAriaPrefix: "Project:",
  },
  journeyPreview: {
    eyebrow: "03 · Journey",
    title: "A Life in Motion",
    subtitle: "Explore the places that have shaped my journey.",
    action: "Launch Interactive Globe",
    previewLabel: "Interactive globe preview",
    orbitLabel: "13 places, one evolving perspective",
  },
  hobbies: {
    eyebrow: "04 · Beyond Research",
    title: "Beyond Research",
    introduction:
      "The things I return to when I am not reading papers, writing code, or thinking about robots.",
  },
  contact: {
    eyebrow: "05 · Contact",
    title: "Let’s Connect",
    introduction:
      "I’m always interested in conversations about AI, robotics, research, and new ideas.",
    linksLabel: "Contact and profile links",
  },
  footer: {
    copyrightOwner: "Qifeng(Eli) Liang",
    builtWith: "Built with React",
    backToTop: "Back to top",
  },
  journeyMode: {
    ariaLabel: "Interactive travel journey",
    backButton: "Back to Portfolio",
    backButtonAria: "Close journey and return to portfolio",
    instructions: "Drag to rotate · Scroll or pinch to zoom · Select a highlighted country",
    closeDetails: "Close country details",
    photoPlaceholder: "Travel photography placeholder",
    regionalNote: "Regional map coming in a future update.",
    citiesTitle: "Places",
    selectedCountryLabel: "Selected country",
  },
} as const;

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "YOUR_GITHUB_URL", icon: "github" },
  { label: "LinkedIn", href: "YOUR_LINKEDIN_URL", icon: "linkedin" },
  { label: "Email", href: "mailto:YOUR_EMAIL", icon: "email" },
  { label: "Resume", href: "YOUR_RESUME_URL", icon: "resume" },
];

/**
 * Component-level status text lives here so temporary UI states never become
 * scattered hard-coded copy. Edit these alongside the rest of the site copy.
 */
export const uiStatusText = {
  loadingJourney: "Preparing the interactive globe…",
  loadingCountries: "Loading world map…",
  countryDataError: "The world map could not be loaded.",
  notVisited: "Not yet part of the journey.",
  linkPlaceholder: "Placeholder link — update it in src/config/siteContent.ts",
  unavailableLink: "This link is ready for your real URL.",
} as const;

export const themeTokens = {
  colors: {
    page: "#F7F8FA",
    ink: "#0F172A",
    muted: "#475569",
    cyan: "#0891B2",
    sky: "#0EA5E9",
    gold: "#D6A84B",
    journey: "#030712",
    journeyCyan: "#22D3EE",
    journeyGold: "#E8C66A",
  },
} as const;
