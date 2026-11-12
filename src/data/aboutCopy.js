import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS } from "../utils/pricing";

// About page copy. Shared by About.js and the Cloudflare Worker (which serves the same
// words to search engines). Different from the home page copy on purpose, so the two
// pages don't compete as duplicates. Only facts the store states elsewhere (FAQ,
// Services.js, pricing rules, contact details in the footer).
// A paragraph is a list of pieces: plain text, or [link text, path].
export const aboutCopy = {
  heading: "About Metal Poster Town",
  intro: [
    "Metal Poster Town is an Indian online store that makes one thing: metal posters. Every design we sell is printed on a 1 mm galvanised steel sheet instead of paper, for fans who want their favourite characters on the wall in a form that lasts.",
  ],
  sections: [
    {
      heading: "What we make",
      paragraph: [
        "We print ultra HD artwork from anime, superheroes, games, cars and films onto steel. Metal doesn't tear, curl or crease, it wipes clean with a dry cloth, and it holds colour and detail in a way paper can't. Most designs come in Small (A4), Medium (A3) and Large (A2), so the same poster works on a desk, a bedroom wall or above a sofa. Start with our ",
        ["anime metal posters", "/collections/anime"],
        " or browse ",
        ["every design", "/products"],
        ".",
      ],
    },
    {
      heading: "Made to hang without drilling",
      paragraph: [
        "Small and medium posters come with a sticker plus magnet mount. Stick the mount to a clean, flat wall, place the poster on it, and the steel holds to the magnet. There's no drilling, and you can swap designs whenever you like. Large posters can use a back frame for a stronger hold.",
      ],
    },
    {
      heading: "How ordering works",
      paragraph: [
        `You pay with any UPI app, and we confirm every payment before the order ships. Orders leave within two days and reach most of India in 3 to 7 days. Shipping is free when you buy ${FREE_SHIPPING_MIN_ITEMS} or more posters, and any ${A4_BUNDLE_SIZE} A4 posters cost ₹${A4_BUNDLE_PRICE} together. If a poster arrives damaged or not quite right, tell us within 7 days with a photo and we'll sort it out.`,
      ],
    },
    {
      heading: "Talk to us",
      paragraph: [
        "We're a small team and we read every message. WhatsApp or call us on +91 9953749307, email Official@metalpostertown.in, or find new designs first on Instagram at @metalpostertown. If there's a character you'd like on metal, tell us: new artwork is added to the catalogue as fans ask for it.",
      ],
    },
  ],
};
