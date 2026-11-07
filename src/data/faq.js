import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS, SHIPPING_FEE } from "../utils/pricing";

// Store FAQ, shown on the home page and product pages (components/FaqSection.js) and
// published there as schema.org FAQPage data. Answers are plain text so the visible
// copy and the structured data are always the same words. Only state what the store
// already promises elsewhere (Services.js, the checkout and the pricing rules).
export const storeFaq = [
  {
    question: "What is a metal poster?",
    answer:
      "It's artwork printed on a 1 mm galvanised steel sheet instead of paper. It won't tear, curl or fade like a paper poster, and the metal gives colours a rich, glossy finish.",
  },
  {
    question: "What sizes are available?",
    answer:
      "Most designs come in three sizes: Small (A4, 12 x 9 inches), Medium (A3, 15.8 x 12 inches) and Large (A2, 24 x 18 inches). Each product page shows the sizes and prices for that design.",
  },
  {
    question: "How do I put it on the wall?",
    answer:
      "Small and medium posters use the included sticker plus magnet setup. Larger sizes can use a back frame for a stronger hold.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are dispatched within 24 to 48 hours and reach most of India in 3 to 7 days, depending on your location.",
  },
  {
    question: "Is shipping free?",
    answer: `Shipping is free when you buy ${FREE_SHIPPING_MIN_ITEMS} or more posters. A single poster ships for ₹${SHIPPING_FEE}.`,
  },
  {
    question: "Do you have bundle offers?",
    answer: `Yes. Any ${A4_BUNDLE_SIZE} A4 posters cost ₹${A4_BUNDLE_PRICE} in total. Mix any designs; the price is applied automatically in your cart.`,
  },
  {
    question: "How do I pay?",
    answer:
      "Pay with any UPI app at checkout and enter the UPI transaction reference (UTR). We confirm every payment before your order ships.",
  },
  {
    question: "Will the print look exactly like the photo?",
    answer:
      "The artwork and finish stay very close to the product photos. Small colour differences can come from your screen's brightness and display settings.",
  },
  {
    question: "What if my poster arrives damaged?",
    answer:
      "Tell us within 7 days of delivery and send photos of the damage. We'll arrange a replacement or another fix for the problem.",
  },
];
