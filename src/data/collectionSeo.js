// Search copy for collection pages: the page title and description (set by the
// Cloudflare Worker in worker/index.js and by CollectionPage), and a short intro shown
// on the page under the posters. Each targets one search phrase ("keyword").
// Collections not listed here get "<Title> Metal Posters | Poster Town".
const MATERIAL =
  "Every poster is printed on 1 mm galvanised steel in ultra HD, in A4, A3 and A2 sizes. Small and medium sizes mount with a sticker plus magnet setup, no drilling needed.";

export const collectionSeo = {
  anime: {
    keyword: "anime metal poster",
    title: "Anime Metal Posters – Ultra HD Anime Wall Art | Poster Town",
    description:
      "Ultra high definition anime metal posters: Demon Slayer, One Piece, Naruto, Jujutsu Kaisen, Solo Leveling and Dragon Ball on 1 mm steel. Free shipping on 2+.",
    heading: "Ultra HD anime metal posters",
    intro: `Our anime metal posters bring the most iconic moments from Demon Slayer, One Piece, Naruto, Jujutsu Kaisen, Solo Leveling and Dragon Ball to your wall. Colours stay sharp and glossy on metal in a way paper can't match. ${MATERIAL}`,
  },
  "demon-slayer": {
    keyword: "demon slayer metal poster",
    title: "Demon Slayer Metal Posters – Tanjiro, Rengoku & More | Poster Town",
    description:
      "Demon Slayer metal posters of Tanjiro, Zenitsu, Inosuke, Rengoku, Giyu and Akaza in ultra HD on 1 mm steel. A4, A3 and A2. Free shipping on 2+ posters.",
    heading: "Demon Slayer metal posters",
    intro: `Breathing styles, Hashira and the demons of Kimetsu no Yaiba, printed on metal. This Demon Slayer metal poster collection covers Tanjiro, Zenitsu, Inosuke, Rengoku, Giyu, Sanemi and Akaza, with flame, water and thunder effects that glow on a metal surface. ${MATERIAL}`,
  },
  "one-piece": {
    keyword: "one piece metal poster",
    title: "One Piece Metal Posters – Luffy Gear 5, Zoro & Shanks | Poster Town",
    description:
      "One Piece metal posters of Luffy's Gear 5, Zoro, Shanks and the Straw Hat crew in ultra HD on 1 mm steel. A4, A3 and A2 sizes. Free shipping on 2+ posters.",
    heading: "One Piece metal posters",
    intro: `Set sail with the Straw Hat Pirates. Our One Piece metal posters feature Luffy's Gear 5, Zoro, Shanks and wanted-poster designs straight from the Grand Line, sized for a desk, a bedroom wall or a whole crew lineup. ${MATERIAL}`,
  },
  naruto: {
    keyword: "naruto metal poster",
    title: "Naruto Metal Posters – Naruto, Sasuke, Itachi & Madara | Poster Town",
    description:
      "Naruto metal posters of Naruto, Sasuke, Itachi, Madara and the Akatsuki in ultra HD on 1 mm steel. A4, A3 and A2 sizes. Free shipping on 2+ posters.",
    heading: "Naruto metal posters",
    intro: `From the Hidden Leaf to the Fourth Great Ninja War, our Naruto metal posters cover Naruto, Sasuke, Itachi, Madara and the Akatsuki. The Sharingan reds and chakra blues look especially striking on metal. ${MATERIAL}`,
  },
  "jujutsu-kaisen": {
    keyword: "gojo metal poster",
    title: "Gojo & Jujutsu Kaisen Metal Posters | Poster Town",
    description:
      "Satoru Gojo and Jujutsu Kaisen metal posters in ultra HD on 1 mm steel: neon Gojo, Sukuna and more. A4, A3 and A2 sizes. Free shipping on 2+ posters.",
    heading: "Gojo and Jujutsu Kaisen metal posters",
    intro: `Domain Expansion, on your wall. Our Jujutsu Kaisen metal posters include neon Satoru Gojo designs and the sorcerers and curses of Jujutsu High, printed in high contrast so every glow and shadow stands out. ${MATERIAL}`,
  },
  "solo-leveling": {
    keyword: "solo leveling metal poster",
    title: "Solo Leveling Metal Posters – Sung Jinwoo | Poster Town",
    description:
      "Solo Leveling metal posters of Sung Jinwoo and the shadow army in ultra HD on 1 mm steel. A4, A3 and A2 sizes. Free shipping on 2+ posters.",
    heading: "Solo Leveling metal posters",
    intro: `Arise. Our Solo Leveling metal posters follow Sung Jinwoo from E-rank hunter to Shadow Monarch, with the deep purples and blacks of the shadow army printed sharp on metal. ${MATERIAL}`,
  },
  superheroes: {
    keyword: "batman metal poster",
    title: "Batman & Superhero Metal Posters – DC and Marvel | Poster Town",
    description:
      "Batman metal posters and DC and Marvel superhero wall art in ultra HD on 1 mm steel: neon Batman, Deadpool and more. Free shipping on 2+ posters.",
    heading: "Batman and superhero metal posters",
    intro: `Gotham's Dark Knight leads this collection, with Batman metal posters in neon and movie styles alongside Deadpool and the rest of DC and Marvel's heroes and anti-heroes. ${MATERIAL}`,
  },
  "black-metal-posters": {
    keyword: "black metal poster",
    title: "Black Metal Posters – Dark Anime & Neon Wall Art | Poster Town",
    description:
      "Black metal posters: dark, high-contrast anime, superhero and car designs on 1 mm steel, where neon and fire pop off a black background. Free shipping on 2+.",
    heading: "Black metal posters",
    intro: `Some designs are made for a dark wall. These black metal posters use deep black backgrounds so neon, fire, lightning and glowing eyes hit harder, perfect for gaming setups and moody bedrooms. ${MATERIAL}`,
  },
  "attack-on-titan": {
    keyword: "attack on titan metal poster",
    title: "Attack on Titan Metal Posters – Eren & Levi | Poster Town",
    description:
      "Attack on Titan metal posters of Eren, Levi, Mikasa and the Survey Corps in ultra HD on 1 mm steel. Free shipping on 2+ posters.",
    heading: "Attack on Titan metal posters",
    intro: `Eren, Levi, Mikasa and the Survey Corps beyond the walls, printed on metal. ${MATERIAL}`,
  },
  football: {
    keyword: "messi metal poster",
    title: "Messi & Football Metal Posters | Poster Town",
    description: "Messi and football metal posters in ultra HD on 1 mm steel. A4, A3 and A2 sizes. Free shipping on 2+ posters.",
    heading: "Messi and football metal posters",
    intro: `Football legends like Lionel Messi, printed on metal for your room, gym or office. ${MATERIAL}`,
  },
  music: {
    keyword: "music metal poster",
    title: "Music Metal Posters – Artists & Album Art | Poster Town",
    description: "Music metal posters of artists and iconic album art in ultra HD on 1 mm steel. Free shipping on 2+ posters.",
    heading: "Music metal posters",
    intro: `Music legends and iconic album art, printed on metal for your room or studio. ${MATERIAL}`,
  },
};

export const collectionSeoFor = (collection) =>
  collectionSeo[collection.slug] || {
    title: `${collection.title} Metal Posters | Poster Town`,
    description: `${collection.description} Printed on 1 mm metal in A4, A3 and A2 sizes.`,
  };
