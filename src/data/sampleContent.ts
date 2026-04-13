import { ContentItem } from "@/types/content";

export const sampleContent: ContentItem[] = [
  {
    id: "film-1",
    type: "film",
    title: "Blade Runner 2049",
    description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    tags: ["sci-fi", "thriller", "cyberpunk"],
    thumbnail: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/gCcx85zbxz4" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=gCcx85zbxz4" },
    meta: { duration: "2h 44m", author: "Denis Villeneuve", date_added: "2024-01-15", source: "YouTube" }
  },
  {
    id: "film-2",
    type: "film",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    tags: ["sci-fi", "drama", "space"],
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/zSWdZVtXT7E" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=zSWdZVtXT7E" },
    meta: { duration: "2h 49m", author: "Christopher Nolan", date_added: "2024-01-10", source: "YouTube" }
  },
  {
    id: "series-1",
    type: "series",
    title: "Stranger Things",
    description: "When a young boy disappears, his mother and friends must confront terrifying supernatural forces.",
    tags: ["horror", "drama", "80s"],
    thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/b9EkMc79ZSU" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=b9EkMc79ZSU" },
    meta: { duration: "4 seasons", author: "Duffer Brothers", date_added: "2024-02-01", source: "YouTube" }
  },
  {
    id: "series-2",
    type: "series",
    title: "The Mandalorian",
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
    tags: ["sci-fi", "action", "star-wars"],
    thumbnail: "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/aOC8E8z_ifw" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=aOC8E8z_ifw" },
    meta: { duration: "3 seasons", author: "Jon Favreau", date_added: "2024-02-05", source: "YouTube" }
  },
  {
    id: "music-1",
    type: "music",
    title: "Synthwave Retro Mix",
    description: "A curated collection of the best synthwave and retrowave tracks for coding sessions.",
    tags: ["synthwave", "electronic", "retro"],
    thumbnail: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/4xDzrJKXOOY" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=4xDzrJKXOOY" },
    meta: { duration: "1h 23m", author: "Various Artists", date_added: "2024-03-01", source: "YouTube" }
  },
  {
    id: "music-2",
    type: "music",
    title: "Lo-Fi Hip Hop Beats",
    description: "Relaxing beats to study and chill to. Perfect background music.",
    tags: ["lo-fi", "chill", "study"],
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/jfKfPfyJRdk" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
    meta: { duration: "Live", author: "Lofi Girl", date_added: "2024-03-05", source: "YouTube" }
  },
  {
    id: "podcast-1",
    type: "podcast",
    title: "The Future of AI",
    description: "Deep dive into artificial intelligence trends and their impact on society.",
    tags: ["tech", "AI", "future"],
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/5qap5aO4i9A" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=5qap5aO4i9A" },
    meta: { duration: "58m", author: "Lex Fridman", date_added: "2024-04-01", source: "YouTube" }
  },
  {
    id: "podcast-2",
    type: "podcast",
    title: "Design Systems Deep Dive",
    description: "Exploring how top companies build and maintain their design systems.",
    tags: ["design", "UX", "systems"],
    thumbnail: "https://images.unsplash.com/photo-1558403194-611308249627?w=400&h=225&fit=crop",
    embed: { provider: "youtube", iframe: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>', url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    meta: { duration: "45m", author: "Design Matters", date_added: "2024-04-05", source: "YouTube" }
  },
  {
    id: "codepen-1",
    type: "codepen",
    title: "CSS Grid Animation",
    description: "Beautiful CSS grid layout with smooth animations and transitions.",
    tags: ["CSS", "animation", "grid"],
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop",
    embed: { provider: "codepen", iframe: '<iframe src="https://codepen.io/team/codepen/embed/PNaGbb" frameborder="0" allowfullscreen></iframe>', url: "https://codepen.io/team/codepen/pen/PNaGbb" },
    meta: { duration: "N/A", author: "CodePen Team", date_added: "2024-05-01", source: "CodePen" }
  },
  {
    id: "codepen-2",
    type: "codepen",
    title: "Three.js Particles",
    description: "Interactive 3D particle system built with Three.js and WebGL.",
    tags: ["3D", "WebGL", "interactive"],
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop",
    embed: { provider: "codepen", iframe: '<iframe src="https://codepen.io/team/codepen/embed/preview/PNaGbb" frameborder="0" allowfullscreen></iframe>', url: "https://codepen.io/team/codepen/pen/PNaGbb" },
    meta: { duration: "N/A", author: "Creative Dev", date_added: "2024-05-05", source: "CodePen" }
  },
  {
    id: "gallery-1",
    type: "gallery",
    title: "Cyberpunk City Scapes",
    description: "A collection of stunning cyberpunk-inspired city photographs and digital art.",
    tags: ["cyberpunk", "art", "city"],
    thumbnail: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=225&fit=crop",
    embed: { provider: "gallery", iframe: "", url: "" },
    meta: { duration: "12 photos", author: "Various Artists", date_added: "2024-06-01", source: "Unsplash" }
  },
  {
    id: "gallery-2",
    type: "gallery",
    title: "Neon Nights Collection",
    description: "Vibrant neon-lit urban photography from around the world.",
    tags: ["neon", "urban", "night"],
    thumbnail: "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=400&h=225&fit=crop",
    embed: { provider: "gallery", iframe: "", url: "" },
    meta: { duration: "8 photos", author: "Night Photographers", date_added: "2024-06-10", source: "Unsplash" }
  },
];

export const galleryImages: Record<string, string[]> = {
  "gallery-1": [
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=800&h=500&fit=crop",
  ],
  "gallery-2": [
    "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=500&fit=crop",
  ],
};
