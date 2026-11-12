import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS } from "../utils/pricing";

// About-the-store copy on the home page (~600 words), written around the searches
// the site targets ("metal poster", "metal poster for wall", "anime metal poster",
// "ultra hd metal poster", the series names...). Each series links to its collection
// page, which is what helps those pages rank. Only state what the store already
// promises (Services.js, the FAQ, the pricing rules).
//
// Shared by the home page (components/HomeSeoCopy.js) and the Cloudflare Worker,
// which serves the same words to search engines before the app loads.
// A paragraph is a list of pieces: plain text, or [link text, path].
export const homeCopyIntro = {
  heading: "Metal posters for your wall, made by Metal Poster Town",
  paragraph: [
    "Metal Poster Town (metalpostertown.in) is an online metal poster company for fans across India. Instead of paper, we print artwork on 1 mm galvanised steel, so every metal poster for wall display stays flat, sharp and vivid. Whether you're decorating a bedroom, a gaming setup, a studio or an office, a metal poster gives your wall the finish of a gallery piece, without the curling corners, tape marks or fading that come with paper prints.",
  ],
};

export const homeCopySections = [
  {
    heading: "Why choose a metal poster over paper?",
    paragraph: [
      "A metal poster is printed directly onto a coated steel sheet. The result is an ultra HD metal poster with deep blacks, glossy colours and crisp detail you can see from across the room. Steel doesn't tear, crease or curl, and it wipes clean with a soft dry cloth. Small and medium sizes hang with a sticker plus magnet mount, so you can put a metal poster on the wall without drilling and swap designs whenever you like.",
    ],
  },
  {
    heading: "Ultra high definition anime metal posters",
    paragraph: [
      "Anime is our biggest range. Our ultra high definition anime metal posters cover the series fans ask for most: ",
      ["Demon Slayer metal posters", "/collections/demon-slayer"],
      " of Tanjiro, Rengoku and the Hashira; ",
      ["One Piece metal posters", "/collections/one-piece"],
      " of Luffy's Gear 5, Zoro and Shanks; ",
      ["Naruto metal posters", "/collections/naruto"],
      " of Naruto, Sasuke, Itachi and Madara; ",
      ["Gojo metal posters", "/collections/jujutsu-kaisen"],
      " from Jujutsu Kaisen; ",
      ["Solo Leveling metal posters", "/collections/solo-leveling"],
      " of Sung Jinwoo; and ",
      ["Dragon Ball Z", "/collections/dragon-ball-z"],
      " designs full of Super Saiyan energy. See them all in our ",
      ["anime metal poster collection", "/collections/anime"],
      ".",
    ],
  },
  {
    heading: "Superheroes, cars, games and dark designs",
    paragraph: [
      "Beyond anime, you'll find ",
      ["Batman metal posters", "/collections/superheroes"],
      " alongside other DC and Marvel heroes, ",
      ["car metal posters", "/collections/cars"],
      " for petrolheads, Call of Duty and ",
      ["gaming metal posters", "/collections/gaming"],
      " for your battle station, and movie favourites. If your room has a darker mood, our ",
      ["black metal posters", "/collections/black-metal-posters"],
      " set neon, fire and lightning against deep black backgrounds, where they hit hardest.",
    ],
  },
  {
    heading: "Sizes for every wall",
    paragraph: [
      "Most designs come in three sizes: Small (A4, 12 x 9 inches) for desks and shelves, Medium (A3, 15.8 x 12 inches) for bedroom and gaming walls, and Large (A2, 24 x 18 inches) for a statement piece above a bed or sofa. Mix sizes to build a gallery wall around one fandom, or line up a whole crew from the same series.",
    ],
  },
  {
    heading: "Offers, delivery and payment",
    paragraph: [
      `Shipping is free when you buy ${FREE_SHIPPING_MIN_ITEMS} or more posters, and any ${A4_BUNDLE_SIZE} A4 metal posters cost ₹${A4_BUNDLE_PRICE} in total, so starting a collection is easy. Orders are dispatched within 24 to 48 hours and reach most of India in 3 to 7 days. You pay with any UPI app, and we confirm every payment before your order ships. If a poster arrives damaged, tell us within 7 days and we'll sort it out.`,
    ],
  },
  {
    heading: "A gift that lasts",
    paragraph: [
      `A metal poster makes an easy gift for an anime fan, a gamer or a car lover. Pick their favourite character, choose a size, and it arrives ready to go up on the wall, no frame needed. Because it's printed on steel, it lasts far longer than a paper poster, and with free shipping on ${FREE_SHIPPING_MIN_ITEMS} or more you can add a second design for yourself.`,
    ],
  },
  {
    heading: "Why fans choose Metal Poster Town",
    wide: true,
    paragraph: [
      "We're a dedicated metal poster company, so everything we sell is made for metal: designs picked to look their best on steel, careful packing for safe delivery, and new artwork added to the catalogue as fans ask for it. Browse ",
      ["every metal poster", "/products"],
      " or start with our ",
      ["collections", "/collections"],
      " to find the one that belongs on your wall.",
    ],
  },
];
