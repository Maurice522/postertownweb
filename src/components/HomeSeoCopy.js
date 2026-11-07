import { Link } from "react-router-dom";
import styled from "styled-components";
import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS } from "../utils/pricing";

// About-the-store copy on the home page (~600 words), written around the searches
// the site targets ("metal poster", "metal poster for wall", "anime metal poster",
// "ultra hd metal poster", the series names...). Each series links to its collection
// page, which is what helps those pages rank. Only state what the store already
// promises (Services.js, the FAQ, the pricing rules).
const HomeSeoCopy = () => (
  <Wrapper aria-labelledby="about-metal-posters">
    <header className="seo-intro">
      <h2 id="about-metal-posters">Metal posters for your wall, made by Metal Poster Town</h2>
      <p>
        Metal Poster Town (metalpostertown.in) is an online metal poster company for fans across India. Instead of paper,
        we print artwork on 1 mm galvanised steel, so every metal poster for wall display stays flat, sharp and vivid. Whether
        you're decorating a bedroom, a gaming setup, a studio or an office, a metal poster gives your wall the finish of a
        gallery piece, without the curling corners, tape marks or fading that come with paper prints.
      </p>
    </header>

    <div className="seo-grid">
      <section>
        <h3>Why choose a metal poster over paper?</h3>
        <p>
          A metal poster is printed directly onto a coated steel sheet. The result is an ultra HD metal poster with deep
          blacks, glossy colours and crisp detail you can see from across the room. Steel doesn't tear, crease or curl, and
          it wipes clean with a soft dry cloth. Small and medium sizes hang with a sticker plus magnet mount, so you can put a
          metal poster on the wall without drilling and swap designs whenever you like.
        </p>
      </section>

      <section>
        <h3>Ultra high definition anime metal posters</h3>
        <p>
          Anime is our biggest range. Our ultra high definition anime metal posters cover the series fans ask for most:{" "}
          <Link to="/collections/demon-slayer">Demon Slayer metal posters</Link> of Tanjiro, Rengoku and the Hashira;{" "}
          <Link to="/collections/one-piece">One Piece metal posters</Link> of Luffy's Gear 5, Zoro and Shanks;{" "}
          <Link to="/collections/naruto">Naruto metal posters</Link> of Naruto, Sasuke, Itachi and Madara;{" "}
          <Link to="/collections/jujutsu-kaisen">Gojo metal posters</Link> from Jujutsu Kaisen;{" "}
          <Link to="/collections/solo-leveling">Solo Leveling metal posters</Link> of Sung Jinwoo; and{" "}
          <Link to="/collections/dragon-ball-z">Dragon Ball Z</Link> designs full of Super Saiyan energy. See them all in our{" "}
          <Link to="/collections/anime">anime metal poster collection</Link>.
        </p>
      </section>

      <section>
        <h3>Superheroes, cars, games and dark designs</h3>
        <p>
          Beyond anime, you'll find <Link to="/collections/superheroes">Batman metal posters</Link> alongside other DC and
          Marvel heroes, <Link to="/collections/cars">car metal posters</Link> for petrolheads, Call of Duty and{" "}
          <Link to="/collections/gaming">gaming metal posters</Link> for your battle station, and movie favourites. If your room
          has a darker mood, our <Link to="/collections/black-metal-posters">black metal posters</Link> set neon, fire and
          lightning against deep black backgrounds, where they hit hardest.
        </p>
      </section>

      <section>
        <h3>Sizes for every wall</h3>
        <p>
          Most designs come in three sizes: Small (A4, 12 x 9 inches) for desks and shelves, Medium (A3, 15.8 x 12 inches)
          for bedroom and gaming walls, and Large (A2, 24 x 18 inches) for a statement piece above a bed or sofa. Mix sizes to
          build a gallery wall around one fandom, or line up a whole crew from the same series.
        </p>
      </section>

      <section>
        <h3>Offers, delivery and payment</h3>
        <p>
          Shipping is free when you buy {FREE_SHIPPING_MIN_ITEMS} or more posters, and any {A4_BUNDLE_SIZE} A4 metal posters
          cost ₹{A4_BUNDLE_PRICE} in total, so starting a collection is easy. Orders are dispatched within 24 to 48 hours and
          reach most of India in 3 to 7 days. You pay with any UPI app, and we confirm every payment before your order ships.
          If a poster arrives damaged, tell us within 7 days and we'll sort it out.
        </p>
      </section>

      <section>
        <h3>A gift that lasts</h3>
        <p>
          A metal poster makes an easy gift for an anime fan, a gamer or a car lover. Pick their favourite character, choose a
          size, and it arrives ready to go up on the wall, no frame needed. Because it's printed on steel, it lasts far longer
          than a paper poster, and with free shipping on {FREE_SHIPPING_MIN_ITEMS} or more you can add a second design for
          yourself.
        </p>
      </section>

      <section className="wide">
        <h3>Why fans choose Metal Poster Town</h3>
        <p>
          We're a dedicated metal poster company, so everything we sell is made for metal: designs picked to look their best
          on steel, careful packing for safe delivery, and new artwork added to the catalogue as fans ask for it. Browse{" "}
          <Link to="/products">every metal poster</Link> or start with our <Link to="/collections">collections</Link> to
          find the one that belongs on your wall.
        </p>
      </section>
    </div>
  </Wrapper>
);

const Wrapper = styled.section`
  width: min(100% - 3.2rem, 120rem);
  margin: 5rem auto 0;
  color: #3d342e;

  .seo-intro {
    max-width: 92rem;
    margin-bottom: 2.8rem;
  }

  h2 {
    font-size: clamp(2.6rem, 3.4vw, 3.8rem);
    line-height: 1.15;
    margin-bottom: 1.4rem;
  }

  h3 {
    font-size: 1.9rem;
    margin-bottom: 0.8rem;
    color: #231f20;
  }

  p {
    color: #5f544b;
    line-height: 1.8;
    font-size: 1.55rem;
  }

  .seo-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.4rem 3.2rem;
  }

  .seo-grid .wide {
    grid-column: 1 / -1;
  }

  .seo-grid section {
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    padding: 2.2rem 2.4rem;
  }

  a {
    color: #b4532a;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .seo-grid {
      grid-template-columns: 1fr;
      gap: 1.6rem;
    }

    .seo-grid section {
      padding: 1.8rem;
    }
  }
`;

export default HomeSeoCopy;
