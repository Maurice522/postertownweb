// Store collections. A product is in a collection when any of these hold:
// 1. its subcategory is in the collection's `subCategories` list (e.g. "Dragon Ball Super"),
// 2. its saved product.collections lists the slug (set at upload by Gemini + the backend's
//    rules, see postertown_backend/src/utils/collections.js),
// 3. the collection's `match` rule fits (covers older products).
// Empty collections are hidden.
const isDemonSlayer = (product) =>
  /demon slayer|giyu|rengoku|tanjiro|inosuke|zenitsu|sanemi/i.test(
    `${product.subCategory} ${product.name}`
  );

const isDragonBall = (product) =>
  // Whole words only, so "Rengoku" isn't mistaken for Goku.
  /\b(dragon ball|goku|vegeta|broly|frieza|freeza|gohan|majin|buu)\b/i.test(`${product.subCategory} ${product.name}`);

const mentions = (product, pattern) =>
  pattern.test(`${product.subCategory} ${product.name} ${(product.filters?.character || []).join(" ")}`);

const hasBadge = (product, badge) =>
  (product.badges || product.tags || []).some((value) => String(value).toLowerCase() === badge);

export const collectionDefinitions = [
  {
    slug: "demon-slayer",
    subCategories: ["Demon Slayer", "Kimetsu no Yaiba", "Giyu Tomioka", "Rengoku", "Tanjiro", "Inosuke", "Zenitsu", "Sanemi"],
    title: "Demon Slayer",
    tagline: "Hashira, flames and water breathing",
    description:
      "Giyu, Rengoku and the Corps in vivid metal prints. Built for a wall that feels like the Infinity Castle.",
    accent: "#3d7bd9",
    featured: true,
    match: isDemonSlayer,
    // Home page section: background art and upcoming designs shown as "Coming soon".
    wallImage: "/images/demonslayerall.jpg",
    showcase: [],
  },
  {
    slug: "dragon-ball-z",
    subCategories: ["Dragon Ball", "Dragon Ball Z", "Dragon Ball Super", "Dragon Ball GT", "Dragon Ball Daima"],
    title: "Dragon Ball Z",
    tagline: "Saiyans, transformations and power levels",
    description:
      "Broly's fury, Goku's Ultra Instinct and the villains who pushed them there. Over-9000 energy for your wall.",
    accent: "#e8892b",
    match: isDragonBall,
    wallImage: "/images/dbzwall.jpeg",
    showcase: [{ name: "Goku Ultra Instinct", image: "/images/gokuui.jpg" }],
  },
  {
    slug: "naruto",
    subCategories: ["Naruto", "Naruto Shippuden", "Boruto"],
    title: "Naruto",
    tagline: "Hidden Leaf legends",
    description: "Naruto, Sasuke, Itachi and the Akatsuki, from Sage Mode to the Fourth Great Ninja War.",
    accent: "#f08a24",
    match: (product) => mentions(product, /\b(naruto|sasuke|itachi|kakashi|madara|jiraiya)\b/i),
  },
  {
    slug: "one-piece",
    subCategories: ["One Piece", "Luffy Gear 5"],
    title: "One Piece",
    tagline: "The Straw Hat crew and the Grand Line",
    description: "Luffy's Gear 5, Zoro's three swords and the rest of the crew chasing the One Piece.",
    accent: "#d64045",
    match: (product) => mentions(product, /\b(one piece|luffy|zoro|sanji|shanks)\b/i),
  },
  {
    slug: "jujutsu-kaisen",
    subCategories: ["Jujutsu Kaisen"],
    title: "Jujutsu Kaisen",
    tagline: "Cursed energy, Domain Expansion",
    description: "Gojo, Sukuna and the sorcerers of Jujutsu High in high-contrast metal.",
    accent: "#7b5cd6",
    match: (product) => mentions(product, /\b(jujutsu kaisen|gojo|sukuna|itadori)\b/i),
  },
  {
    slug: "solo-leveling",
    subCategories: ["Solo Leveling"],
    title: "Solo Leveling",
    tagline: "Arise",
    description: "Sung Jinwoo and his shadow army, from E-rank hunter to Shadow Monarch.",
    accent: "#6a4fd8",
    match: (product) => mentions(product, /\b(solo leveling|jinwoo)\b/i),
  },
  {
    slug: "anime",
    title: "Anime",
    tagline: "Shonen legends on metal",
    description:
      "Solo Leveling, One Piece, Naruto, Dragon Ball and more. Our biggest collection, from quiet character studies to full-power transformations.",
    accent: "#cf6d3f",
    match: (product) => product.category === "Anime",
  },
  {
    slug: "bestsellers",
    title: "Bestsellers",
    tagline: "The prints everyone is hanging",
    description: "The designs our customers order most. A safe pick for a first metal poster or a gift.",
    accent: "#c9962b",
    match: (product) => hasBadge(product, "bestseller"),
  },
  {
    slug: "superheroes",
    subCategories: ["Marvel", "DC", "Superhero", "Batman", "Batman Neon", "Spider-Man", "Deadpool"],
    title: "Superheroes",
    tagline: "DC and Marvel icons",
    description: "Batman in neon, Deadpool mid-chaos, and the heroes and anti-heroes in between.",
    accent: "#b8323c",
    match: (product) => ["DC", "Marvel"].includes(product.category),
  },
  {
    slug: "villains",
    title: "Villains",
    tagline: "The ones you secretly root for",
    description: "Joker, Frieza, Thanos and the rest of fiction's best bad guys. For walls with an edge.",
    accent: "#8e2c48",
    match: (product) => mentions(product, /\b(joker|thanos|darth vader|frieza|freeza|sukuna|muzan|madara|venom)\b/i),
  },
  {
    slug: "call-of-duty",
    subCategories: ["Call of Duty", "Modern Warfare", "Modern Warfare 2", "Warzone"],
    title: "Call of Duty",
    tagline: "Operators, Ghost and Task Force 141",
    description: "Modern Warfare operators and Call of Duty icons for the battle station.",
    accent: "#6b7a4f",
    match: (product) => mentions(product, /\b(call of duty|modern warfare|warzone|black ops)\b/i),
  },
  {
    slug: "gaming",
    title: "Gaming",
    tagline: "For the setup behind the setup",
    description: "Call of Duty and gaming icons sized for the wall above your desk or console.",
    accent: "#4f8a5b",
    match: (product) => product.category === "Games",
  },
  {
    slug: "movies",
    title: "Movies",
    tagline: "Cinema-scale artwork",
    description: "Blockbuster characters and sci-fi giants, printed with the contrast they deserve.",
    accent: "#6d5bd0",
    match: (product) => product.category === "Movie",
  },
  {
    slug: "cars",
    subCategories: ["GT3 RS", "Porsche"],
    title: "Cars",
    tagline: "Performance on the wall",
    description: "Supercars and track legends for garages, studios and anyone who knows their GT3 from their RS.",
    accent: "#5e6b78",
    match: (product) => product.category === "Car",
  },
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    tagline: "Fresh off the press",
    description: "The latest designs added to Poster Town.",
    accent: "#2a9d8f",
    match: (product) => hasBadge(product, "new") || product.flags?.newArrival,
  },
  {
    slug: "wide-prints",
    title: "Wide Prints",
    tagline: "Landscape pieces for big walls",
    description: "Panoramic artwork that fills the space above a bed, sofa or desk.",
    accent: "#8a5c43",
    match: (product) => product.orientation === "landscape",
  },
];

const inCollection = (definition, product) =>
  (definition.subCategories || []).some(
    (name) => name.toLowerCase() === String(product.subCategory || "").trim().toLowerCase()
  ) ||
  (Array.isArray(product.collections) && product.collections.includes(definition.slug)) ||
  definition.match(product);

// Titles of the store collections a product belongs to (used by search).
export const collectionTitlesFor = (product) =>
  collectionDefinitions.filter((definition) => inCollection(definition, product)).map((definition) => definition.title);

// products must already be normalised (see normalizeProducts).
export const buildCollections = (products = []) =>
  collectionDefinitions
    .map((definition) => {
      const items = products.filter((product) => inCollection(definition, product));
      const prices = items.map((product) => Number(product.price)).filter((price) => price > 0);
      return {
        ...definition,
        products: items,
        count: items.length,
        fromPrice: prices.length ? Math.min(...prices) : 0,
        // Portrait art fans out best on the cards, so prefer it for previews.
        previews: [...items]
          .sort((a, b) => Number(a.orientation === "landscape") - Number(b.orientation === "landscape"))
          .slice(0, 3)
          .map((product) => ({ src: product.image, wide: product.orientation === "landscape" })),
      };
    })
    .filter((collection) => collection.count > 0);
