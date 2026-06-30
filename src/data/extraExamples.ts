import { ContentItem } from "@/types/content";

// Hand-curated examples to seed the gallery / code / podcast sections so
// users see how each content type renders even before importing data.
export const extraExamples: ContentItem[] = [
  // --- Galleries ---
  {
    id: "gallery-nature-001",
    type: "gallery",
    title: "Paysages Naturels",
    description: "Une collection de paysages spectaculaires capturés à travers le monde : montagnes, océans, forêts et déserts.",
    tags: ["Nature", "Photo", "Paysage", "2024"],
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
    embed: { provider: "unsplash", iframe: "", url: "https://unsplash.com" },
    meta: { duration: "12 images", author: "Unsplash", date_added: "2024-09-12", source: "Unsplash" },
    galleryItems: [],
  },
  {
    id: "gallery-urban-002",
    type: "gallery",
    title: "Architecture Urbaine",
    description: "Tours, ponts et façades à travers les plus grandes métropoles mondiales.",
    tags: ["Architecture", "Ville", "Photo", "2023"],
    thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600",
    embed: { provider: "unsplash", iframe: "", url: "https://unsplash.com/s/photos/architecture" },
    meta: { duration: "20 images", author: "Various", date_added: "2023-11-05", source: "Unsplash" },
    galleryItems: [],
  },

  // --- Code / CodePen ---
  {
    id: "codepen-css-grid-001",
    type: "codepen",
    title: "CSS Grid Generator",
    description: "Un outil interactif pour générer du CSS Grid en temps réel — parfait pour apprendre les bases.",
    tags: ["CSS", "Code", "Tutoriel", "2024"],
    thumbnail: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600",
    embed: {
      provider: "codepen",
      iframe: '<iframe height="500" src="https://codepen.io/wesbos/embed/jqEpoG" allowfullscreen></iframe>',
      url: "https://codepen.io/wesbos/pen/jqEpoG",
    },
    meta: { duration: "—", author: "Wes Bos", date_added: "2024-03-10", source: "CodePen" },
  },
  {
    id: "codepen-svg-anim-002",
    type: "codepen",
    title: "Animations SVG fluides",
    description: "Démonstration d'animations SVG performantes utilisant uniquement CSS et JavaScript natif.",
    tags: ["SVG", "Animation", "Code", "2023"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
    embed: {
      provider: "codepen",
      iframe: '<iframe height="500" src="https://codepen.io/chriscoyier/embed/qBdGRgL" allowfullscreen></iframe>',
      url: "https://codepen.io/chriscoyier/pen/qBdGRgL",
    },
    meta: { duration: "—", author: "Chris Coyier", date_added: "2023-08-22", source: "CodePen" },
  },

  // --- Podcasts ---
  {
    id: "podcast-tech-001",
    type: "podcast",
    title: "Syntax — Tasty Web Development Treats",
    description: "Wes Bos et Scott Tolinski discutent des dernières tendances du développement web moderne.",
    tags: ["Tech", "Podcast", "Développement", "2024"],
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600",
    embed: {
      provider: "spotify",
      iframe: '<iframe src="https://open.spotify.com/embed/show/4kYCRYJ3yK5DQbP5tbfZby" width="100%" height="232" frameborder="0" allow="encrypted-media"></iframe>',
      url: "https://open.spotify.com/show/4kYCRYJ3yK5DQbP5tbfZby",
    },
    meta: { duration: "60 min", author: "Wes Bos & Scott Tolinski", date_added: "2024-06-15", source: "Spotify" },
  },
  {
    id: "podcast-science-002",
    type: "podcast",
    title: "Sur les Épaules de Darwin",
    description: "Émission scientifique de Jean Claude Ameisen explorant la biologie, l'évolution et la conscience.",
    tags: ["Science", "Podcast", "Culture", "2023"],
    thumbnail: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600",
    embed: {
      provider: "franceinter",
      iframe: '<iframe src="https://www.franceinter.fr/embed/player/aod/sur-les-epaules-de-darwin" width="100%" height="200"></iframe>',
      url: "https://www.radiofrance.fr/franceinter/podcasts/sur-les-epaules-de-darwin",
    },
    meta: { duration: "55 min", author: "Jean Claude Ameisen", date_added: "2023-12-01", source: "France Inter" },
  },
];
