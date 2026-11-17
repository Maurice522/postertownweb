import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS, SHIPPING_FEE } from "../utils/pricing";

// Buying guides at /guides/<slug>, for the questions people search before buying
// ("how to hang a metal poster", "metal vs canvas", "metal poster price in India").
// Shared by pages/GuidePage.js and the Cloudflare Worker (server-rendered text +
// Article schema). Only state what the store actually offers (FAQ, policies, pricing).
//
// Blocks: { h2 }, { p } (string, or pieces: text or [link text, path]), { list },
// { steps }, { table: { head, rows } }, { priceTable: true } (filled from the catalog).
export const GUIDES_UPDATED = "2026-11-17";

export const guides = [
  {
    slug: "how-to-hang-a-metal-poster",
    title: "How to Hang a Metal Poster (Without Drilling)",
    metaTitle: "How to Hang a Metal Poster Without Drilling | Metal Poster Town",
    description:
      "Step-by-step: how to hang a metal poster on any wall without drilling, using a sticker plus magnet mount, plus tips for large posters, renters and gallery walls.",
    intro:
      "A metal poster is light, flat and rigid, so hanging one takes a couple of minutes and no tools. Here's how to put a metal poster on your wall without drilling, and what to do for larger sizes.",
    blocks: [
      { h2: "What you need" },
      {
        list: [
          "Your metal poster (small A4 and medium A3 posters come with a sticker plus magnet mount).",
          "A soft dry cloth to clean the wall.",
          "A pencil or a strip of painter's tape to mark the spot (optional).",
        ],
      },
      { h2: "Step by step" },
      {
        steps: [
          "Pick a smooth, flat spot: painted plaster, wood, glass or tile all work. Avoid textured, damp or freshly painted walls (wait about two weeks after painting).",
          "Wipe the area with a dry cloth so it's free of dust and grease. Adhesives hold best on a clean, dry surface.",
          "Hold the poster against the wall to choose the height. A good rule: the centre of the poster at eye level, around 145–150 cm from the floor.",
          "Peel the backing and press the sticker side of the mount firmly onto the wall for 30 seconds. Firm pressure is what makes it hold.",
          "Place the poster on the mount: the steel sheet sticks to the magnet. Slide it gently to straighten it.",
        ],
      },
      { h2: "Hanging a large (A2) poster" },
      {
        p: "Large posters cover more wall and weigh more, so use a back frame for a stronger hold, the same way you'd hang a framed print. On a wall where you'd rather not make holes, use strong removable picture-hanging strips rated for the poster's weight.",
      },
      { h2: "Tips for renters" },
      {
        list: [
          "The magnet mount means you only stick one small pad to the wall, not the poster itself, so there's no tape on your artwork.",
          "To remove a mount, peel it slowly and parallel to the wall rather than pulling it straight off.",
          "Because the poster sits on a magnet, you can swap designs whenever you like without touching the wall again.",
        ],
      },
      { h2: "Making a gallery wall" },
      {
        p: [
          "Lay the posters out on the floor first, keeping 5–8 cm between them, then mark each mount position on the wall. Mixing one A3 with two A4 posters from the same series works well; ",
          ["any 3 A4 posters", "/products"],
          ` cost ₹${A4_BUNDLE_PRICE} together, and shipping is free on ${FREE_SHIPPING_MIN_ITEMS} or more.`,
        ],
      },
      {
        p: [
          "Looking for something to hang? Start with our ",
          ["anime metal posters", "/collections/anime"],
          " or read ",
          ["what a metal poster is", "/guides/what-is-a-metal-poster"],
          ".",
        ],
      },
    ],
  },
  {
    slug: "what-is-a-metal-poster",
    title: "What Is a Metal Poster?",
    metaTitle: "What Is a Metal Poster? Material, Finish & Sizes | Metal Poster Town",
    description:
      "A metal poster is artwork printed on a thin steel sheet instead of paper. Here's how it's made, how it looks on a wall, the sizes, and how to look after one.",
    intro:
      "A metal poster is artwork printed directly onto a thin sheet of metal instead of paper. It looks like a poster, but it's rigid, wipeable and made to last on a wall for years.",
    blocks: [
      { h2: "How a metal poster is made" },
      {
        p: "Our metal posters are printed on 1 mm galvanised steel. Galvanised steel has a zinc coating that protects it from rust; the sheet is coated so it takes ink, and the design is printed straight onto it in high resolution. The result has a glossy finish with deep blacks and saturated colours.",
      },
      { h2: "Why choose metal over paper" },
      {
        list: [
          "It won't tear, crease, curl at the corners or show tape marks.",
          "Colours stay vivid for years instead of fading like a paper print.",
          "It wipes clean with a soft dry cloth.",
          "It's rigid, so it sits flat on the wall without a frame.",
          "Small and medium sizes hang with a magnet mount, so you can swap designs easily.",
        ],
      },
      { h2: "Sizes" },
      {
        table: {
          head: ["Size", "Dimensions", "Good for"],
          rows: [
            ["Small (A4)", "12 x 9 in", "Desks, shelves, small walls, gallery sets"],
            ["Medium (A3)", "15.8 x 12 in", "Bedroom and gaming walls"],
            ["Large (A2)", "24 x 18 in", "A statement piece above a bed or sofa"],
          ],
        },
      },
      { h2: "Looking after a metal poster" },
      {
        list: [
          "Dust it with a soft, dry cloth.",
          "Avoid harsh chemicals and abrasive cleaners.",
          "Keep it out of long, direct exposure to moisture.",
        ],
      },
      {
        p: [
          "Ready to put one up? Here's ",
          ["how to hang a metal poster without drilling", "/guides/how-to-hang-a-metal-poster"],
          ", and how metal compares with ",
          ["canvas and paper", "/guides/metal-vs-canvas-vs-paper-posters"],
          ".",
        ],
      },
    ],
  },
  {
    slug: "metal-vs-canvas-vs-paper-posters",
    title: "Metal vs Canvas vs Paper Posters: Which Is Best?",
    metaTitle: "Metal vs Canvas vs Paper Posters Compared | Metal Poster Town",
    description:
      "Metal, canvas or paper? Compare finish, durability, hanging, cleaning and price to choose the right wall art for your room.",
    intro:
      "Paper, canvas and metal can all show the same artwork, but they look, last and hang very differently. Here's how they compare, so you can pick the right one for your wall.",
    blocks: [
      { h2: "At a glance" },
      {
        table: {
          head: ["", "Metal poster", "Canvas print", "Paper poster"],
          rows: [
            ["Finish", "Glossy, vivid colours, deep blacks", "Matte, textured fabric look", "Matte or gloss, depends on paper"],
            ["Durability", "Won't tear, crease or curl", "Durable, can sag or dent over time", "Tears, creases and curls easily"],
            ["Fading", "Holds colour for years", "Fades slowly in direct sun", "Fades fastest"],
            ["Hanging", "Rigid; magnet mount, no frame needed", "Wooden frame; usually nails or hooks", "Needs a frame or tape"],
            ["Cleaning", "Wipe with a dry cloth", "Dust gently; hard to clean marks", "Can't really be cleaned"],
            ["Price", "Mid-range", "Mid to high", "Lowest"],
          ],
        },
      },
      { h2: "Choose metal if…" },
      {
        list: [
          "You want bright, high-contrast art, such as anime, neon or dark designs.",
          "The poster goes somewhere it might get touched, such as a kid's room or hallway.",
          "You don't want to frame it, drill or use tape on the art.",
        ],
      },
      { h2: "Choose canvas if…" },
      { p: "You want a soft, textured, painting-like finish, such as for landscapes or classic art, and don't mind a deeper frame on the wall." },
      { h2: "Choose paper if…" },
      { p: "You want the lowest price, will frame it behind glass, or change your art often and don't need it to last." },
      {
        p: [
          "Want to see metal in your colours? Browse our ",
          ["black metal posters", "/collections/black-metal-posters"],
          " for dark rooms, or ",
          ["every design", "/products"],
          ". Not sure about prices? See ",
          ["metal poster prices in India", "/guides/metal-poster-price-in-india"],
          ".",
        ],
      },
    ],
  },
  {
    slug: "metal-poster-price-in-india",
    title: "Metal Poster Price in India: What You'll Pay",
    metaTitle: "Metal Poster Price in India by Size | Metal Poster Town",
    description:
      "How much does a metal poster cost in India? Current prices by size at Metal Poster Town, plus shipping, bundle offers and what affects the price.",
    intro:
      "Metal posters cost more than paper ones but less than most framed art. Here's what they cost at Metal Poster Town right now, by size, and how to get the best price.",
    blocks: [
      { h2: "Current prices by size" },
      { priceTable: true },
      {
        p: "Prices include GST. Each design has its own price within these ranges; the exact price for every size is on the product page.",
      },
      { h2: "Shipping and offers" },
      {
        list: [
          `Shipping is ₹${SHIPPING_FEE} on one poster and free when you buy ${FREE_SHIPPING_MIN_ITEMS} or more.`,
          `Any ${A4_BUNDLE_SIZE} A4 posters cost ₹${A4_BUNDLE_PRICE} together.`,
          "Payment is by UPI, and your order is dispatched within 24 to 48 hours of the payment being confirmed.",
        ],
      },
      { h2: "What affects the price of a metal poster" },
      {
        list: [
          "Size: a larger sheet uses more steel and ink, and costs more to pack and ship safely.",
          "Thickness and material: thicker, galvanised steel resists rust and bending; very thin aluminium sheets are cheaper but dent more easily.",
          "Print quality: high-resolution printing with a protective finish costs more than a basic print.",
          "Mounting: a magnet mount or back frame included in the price saves buying hardware separately.",
        ],
      },
      {
        p: [
          "Read more about ",
          ["what a metal poster is", "/guides/what-is-a-metal-poster"],
          ", or start with our most popular ",
          ["anime metal posters", "/collections/anime"],
          ".",
        ],
      },
    ],
  },
];

export const guideBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));

// "Small (A4)" → { label, min, max } from the live catalog, for the price guide.
export function priceRanges(products = []) {
  const groups = [
    { key: "A4", label: "Small (A4), 12 x 9 in" },
    { key: "A3", label: "Medium (A3), 15.8 x 12 in" },
    { key: "A2", label: "Large (A2), 24 x 18 in" },
  ];
  return groups
    .map((group) => {
      const prices = [];
      for (const product of products) {
        for (const size of product.sizes || []) {
          const paper = size.paper || "";
          const price = Number(size.price);
          if (paper === group.key && price > 0) prices.push(price);
        }
      }
      return prices.length ? { ...group, min: Math.min(...prices), max: Math.max(...prices) } : null;
    })
    .filter(Boolean);
}
