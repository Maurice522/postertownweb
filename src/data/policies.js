import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS, SHIPPING_FEE } from "../utils/pricing";

// Store policies. Shared by pages/PolicyPage.js and the Cloudflare Worker (which serves
// the same words to search engines and to Google Merchant Center's reviewers).
// Only what the store actually does: Cart.js / Orders.js / utils/pricing.js / the FAQ.
// BUSINESS_NAME: the registered business name, shown as the operator of the store.
export const BUSINESS_NAME = "Poster Town";
export const STORE_NAME = "Metal Poster Town";
export const SUPPORT_EMAIL = "Official@metalpostertown.in";
export const SUPPORT_PHONE = "+91 9953749307";
export const POLICY_UPDATED = "15 November 2026";
export const POLICY_DATE = "2026-11-15";

const operator = BUSINESS_NAME ? `${STORE_NAME} (operated by ${BUSINESS_NAME})` : STORE_NAME;
const contactLine = `Email ${SUPPORT_EMAIL} or WhatsApp/call ${SUPPORT_PHONE}.`;

// Each policy: path, title, intro, and sections of { heading, paragraphs, list }.
export const policies = [
  {
    path: "/shipping-policy",
    title: "Shipping Policy",
    metaTitle: "Shipping Policy – Delivery Times & Charges | Metal Poster Town",
    description: `Metal Poster Town ships across India. ₹${SHIPPING_FEE} shipping on one poster, free on ${FREE_SHIPPING_MIN_ITEMS} or more. Dispatched in 24–48 hours, delivered in 3–7 days.`,
    intro: `${operator} ships metal posters to addresses across India. Here is how shipping works.`,
    sections: [
      {
        heading: "Shipping charges",
        list: [
          `₹${SHIPPING_FEE} on an order with one poster.`,
          `Free shipping when your order has ${FREE_SHIPPING_MIN_ITEMS} or more posters.`,
          "The shipping charge is shown in your cart before you pay.",
        ],
      },
      {
        heading: "Dispatch and delivery times",
        list: [
          "We confirm your UPI payment, then dispatch the order within 24 to 48 hours.",
          "Delivery takes 3 to 7 days to most of India; remote areas can take a little longer.",
          "Orders are not dispatched until the payment is confirmed. If we can't match your payment, we'll email you to check it.",
        ],
      },
      {
        heading: "Tracking your order",
        paragraphs: [
          "You'll get an email at each step: payment confirmed, packed, dispatched and delivered. You can also see your order's status on the Orders page while signed in.",
        ],
      },
      {
        heading: "Packaging",
        paragraphs: [
          "Every metal poster is packed flat and protected for the journey. If it arrives damaged, see our Refund & Returns Policy: tell us within 7 days and we'll replace it or refund you.",
        ],
      },
      { heading: "Questions", paragraphs: [contactLine] },
    ],
  },
  {
    path: "/refund-policy",
    title: "Refund & Returns Policy",
    metaTitle: "Refund & Returns Policy – Damaged or Wrong Items | Metal Poster Town",
    description:
      "Damaged or wrong metal poster? Tell Metal Poster Town within 7 days of delivery for a free replacement or a full refund. Orders can be cancelled until dispatch.",
    intro: `We want every poster to arrive perfect. If something goes wrong, ${operator} will put it right.`,
    sections: [
      {
        heading: "Damaged, defective or wrong items",
        list: [
          "Tell us within 7 days of delivery. Use the Return option on the Orders page, or contact us.",
          "Send photos of the poster and the packaging showing the problem.",
          "We'll send a free replacement or give you a full refund for that item, whichever you prefer.",
          "You don't pay anything extra for a replacement.",
        ],
      },
      {
        heading: "Change of mind",
        paragraphs: [
          "Because every poster is printed to order, we can't accept returns for a change of mind, a different taste in design, or a size chosen by mistake. Please check the size guide on the product page before ordering.",
        ],
      },
      {
        heading: "Cancelling an order",
        list: [
          "You can cancel an order any time before it is dispatched, from the Orders page or by contacting us.",
          "Once an order is dispatched, it can't be cancelled.",
          "If you'd already paid, we refund the full amount.",
        ],
      },
      {
        heading: "How refunds are paid",
        paragraphs: [
          "Refunds go back to the UPI ID you paid from, or to a UPI ID or bank account you give us. Once approved, a refund is usually completed within 5 to 7 working days. We'll email you when it's sent.",
        ],
      },
      {
        heading: "Coupons and offers",
        paragraphs: [
          `If a coupon or bundle offer (such as any ${A4_BUNDLE_SIZE} A4 posters for ₹${A4_BUNDLE_PRICE}) applied to your order, the refund is the amount you actually paid for the item.`,
        ],
      },
      { heading: "Contact", paragraphs: [contactLine] },
    ],
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | Metal Poster Town",
    description:
      "How Metal Poster Town collects, uses and protects your personal information when you browse, sign in and order metal posters.",
    intro: `This policy explains what personal information ${operator} collects on metalpostertown.in, why, and the choices you have.`,
    sections: [
      {
        heading: "What we collect",
        list: [
          "Account details: your name, email address and password (stored only as a secure hash), or your Google account name and email if you sign in with Google.",
          "Order details: your delivery address, phone number, the posters you order, and your UPI payment reference (UTR) so we can confirm the payment. We never see or store your UPI PIN or bank login.",
          "Your cart, if you're signed in, so it's saved between visits and we can remind you about it.",
          "Reviews you write, including any photo you upload.",
          "Messages you send us by email, WhatsApp or the website.",
          "Usage data: pages viewed, products added to cart, device and browser type, collected with cookies through Google Analytics.",
        ],
      },
      {
        heading: "How we use it",
        list: [
          "To process, deliver and support your orders, including order status emails.",
          "To run your account and keep it secure.",
          "To answer your questions and handle replacements and refunds.",
          "To send occasional emails about your cart or offers. You can ask us to stop at any time.",
          "To understand how the site is used and improve it.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "We don't sell your personal information. We share it only with services that help us run the store, and only what they need: our delivery partners (name, address and phone), our hosting and database providers, Cloudinary (images), Mailjet (emails), Google (sign-in and analytics) and Cloudflare (website delivery and security). We may also share information when the law requires it.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use cookies and similar browser storage to keep you signed in, remember your cart, and measure site usage with Google Analytics. You can block or delete cookies in your browser settings; the store will still work, but you may need to sign in again.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep order records for as long as needed for accounting and legal requirements, and account details while your account is active. You can ask us to delete your account at any time.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          `You can ask to see, correct or delete the personal information we hold about you, or withdraw consent for marketing emails. Write to ${SUPPORT_EMAIL} and we'll respond within 30 days.`,
        ],
      },
      { heading: "Changes and contact", paragraphs: [`We may update this policy; the date below shows the latest version. ${contactLine}`] },
    ],
  },
  {
    path: "/terms",
    title: "Terms & Conditions",
    metaTitle: "Terms & Conditions | Metal Poster Town",
    description: "The terms for using metalpostertown.in and buying metal posters from Metal Poster Town.",
    intro: `These terms apply when you use metalpostertown.in or buy from ${operator}. By placing an order you agree to them.`,
    sections: [
      {
        heading: "Products",
        list: [
          "Our posters are printed on 1 mm galvanised steel with a glossy finish, in the sizes shown on each product page.",
          "Colours can look slightly different on screen than in print, and each poster is printed to order.",
          "Product designs are fan art and inspired artwork for personal decoration. Character and brand names are used only to describe the design and belong to their respective owners; we are not affiliated with or endorsed by them.",
        ],
      },
      {
        heading: "Prices and payment",
        list: [
          "Prices are in Indian rupees and include GST where applicable. Shipping is shown in the cart before you pay.",
          "Payment is by UPI. An order is confirmed only after we verify the payment.",
          "If a price is shown wrongly because of an error, we'll contact you before dispatch and you can cancel for a full refund.",
          "Coupons and offers can't be combined unless stated, and can be withdrawn at any time; orders already placed are honoured.",
        ],
      },
      {
        heading: "Shipping, cancellations and refunds",
        paragraphs: ["Delivery, cancellation and refunds work as described in our Shipping Policy and our Refund & Returns Policy."],
      },
      {
        heading: "Your account",
        paragraphs: [
          "Keep your login details private; you're responsible for activity on your account. We may suspend accounts used for fraud or abuse.",
        ],
      },
      {
        heading: "Reviews",
        paragraphs: [
          "Reviews can be written only for posters you've bought. We check reviews before publishing and may decline ones that are abusive, off-topic or not about the product. By submitting a review or photo, you allow us to show it on the website.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "Our responsibility for any order is limited to replacing the poster or refunding what you paid for it. Nothing in these terms limits your rights as a consumer under Indian law.",
        ],
      },
      { heading: "Law and contact", paragraphs: [`These terms are governed by the laws of India. ${contactLine}`] },
    ],
  },
];

export const policyByPath = Object.fromEntries(policies.map((policy) => [policy.path, policy]));
