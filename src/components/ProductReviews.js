import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiCamera, FiCheckCircle, FiStar, FiX } from "react-icons/fi";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const emptyForm = { name: "", email: "", rating: 0, comment: "", photoDataUrl: "" };

// Phone photos are often 5+ MB; send a 1600px JPEG instead.
function shrinkPhoto(file, maxSide = 1600) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That photo couldn't be read. Try a JPG or PNG."));
    };
    image.src = url;
  });
}

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const Stars = ({ value, size = "1.6rem" }) => (
  <span className="stars" aria-label={`${value} out of 5 stars`} style={{ fontSize: size }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <FiStar key={star} className={star <= Math.round(value) ? "filled" : ""} aria-hidden="true" />
    ))}
  </span>
);

const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ sending: false, error: "", done: "" });

  useEffect(() => {
    let active = true;
    setLoaded(false);
    fetch(`${API_BASE_URL}/api/reviews?productId=${encodeURIComponent(product.id)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => active && setReviews(Array.isArray(data) ? data : []))
      .catch(() => active && setReviews([]))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [product.id]);

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const wallPhotos = reviews.filter((review) => review.photoUrl);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const choosePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      update("photoDataUrl", await shrinkPhoto(file));
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.rating) {
      setStatus({ sending: false, error: "Tap a star to rate the poster.", done: "" });
      return;
    }
    setStatus({ sending: true, error: "", done: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId: product.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Your review couldn't be sent. Please try again.");
      setForm(emptyForm);
      setFormOpen(false);
      setStatus({ sending: false, error: "", done: data.message });
    } catch (error) {
      setStatus({ sending: false, error: error.message, done: "" });
    }
  };

  return (
    <Wrapper className="reviews-panel">
      <div className="reviews-head">
        <div>
          <h2>Customer Reviews</h2>
          {reviews.length > 0 ? (
            <p className="reviews-summary">
              <Stars value={average} /> <strong>{average.toFixed(1)}</strong> from {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          ) : (
            <p className="reviews-summary">Bought this poster? Tell other fans how it looks on your wall.</p>
          )}
        </div>
        {!formOpen && (
          <button type="button" className="write-btn" onClick={() => setFormOpen(true)}>
            Write a review
          </button>
        )}
      </div>

      {status.done && (
        <p className="review-done">
          <FiCheckCircle /> {status.done}
        </p>
      )}

      {formOpen && (
        <form className="review-form" onSubmit={submit}>
          <div className="rating-pick" role="radiogroup" aria-label="Your rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={form.rating === star}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                className={star <= form.rating ? "filled" : ""}
                onClick={() => update("rating", star)}>
                <FiStar />
              </button>
            ))}
          </div>
          <div className="form-row">
            <label>
              <span>Your name</span>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={60} required />
            </label>
            <label>
              <span>Email (not shown publicly)</span>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={120} />
            </label>
          </div>
          <label>
            <span>Your review</span>
            <textarea
              value={form.comment}
              onChange={(e) => update("comment", e.target.value)}
              rows={4}
              maxLength={1500}
              placeholder="Print quality, colours, packaging, how it looks on the wall…"
              required
            />
          </label>
          <div className="photo-row">
            {form.photoDataUrl ? (
              <div className="photo-preview">
                <img src={form.photoDataUrl} alt="Your poster" />
                <button type="button" aria-label="Remove photo" onClick={() => update("photoDataUrl", "")}>
                  <FiX />
                </button>
              </div>
            ) : (
              <label className="photo-pick">
                <FiCamera /> Add a photo of it on your wall (optional)
                <input type="file" accept="image/*" onChange={choosePhoto} hidden />
              </label>
            )}
          </div>
          {status.error && <p className="review-error">{status.error}</p>}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="write-btn" disabled={status.sending}>
              {status.sending ? "Sending…" : "Submit review"}
            </button>
          </div>
        </form>
      )}

      {wallPhotos.length > 0 && (
        <div className="wall-photos">
          <h3>On customers' walls</h3>
          <div className="wall-grid">
            {wallPhotos.map((review) => (
              <a key={review.id} href={review.photoUrl} target="_blank" rel="noreferrer">
                <img
                  src={review.photoUrl.replace("/upload/", "/upload/c_fill,w_400,h_400,f_auto,q_auto/")}
                  alt={`${review.name}'s wall`}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {loaded && reviews.length === 0 && !formOpen && (
        <p className="reviews-empty">No reviews yet. Be the first to share how it looks on your wall.</p>
      )}
      <div className="reviews-grid">
        {reviews.map((review) => (
          <article key={review.id} className="review-card">
            <div className="review-top">
              <div>
                <h3>{review.name}</h3>
                <span>{formatDate(review.createdAt)}</span>
              </div>
              <Stars value={review.rating} size="1.4rem" />
            </div>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .reviews-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.6rem;
    flex-wrap: wrap;
    margin-bottom: 1.8rem;
  }

  .reviews-summary {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    color: #6a5e54;
  }

  .stars {
    display: inline-flex;
    gap: 0.15rem;
    color: #d8c8b6;
  }

  .stars .filled,
  .rating-pick .filled svg {
    color: #e0a526;
    fill: #e0a526;
  }

  .write-btn {
    min-height: 4.4rem;
    padding: 0 2rem;
    border: none;
    border-radius: 1.2rem;
    background: #231f20;
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
    cursor: pointer;
  }

  .write-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .review-done {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background: #eaf6ef;
    border: 1px solid #b9e0c9;
    color: #1f7a4d;
    border-radius: 1.2rem;
    padding: 1.2rem 1.4rem;
    margin-bottom: 1.6rem;
  }

  .review-form {
    display: grid;
    gap: 1.4rem;
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .rating-pick {
    display: flex;
    gap: 0.4rem;
  }

  .rating-pick button {
    border: none;
    background: none;
    font-size: 3rem;
    color: #d8c8b6;
    cursor: pointer;
    padding: 0.2rem;
    display: grid;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.4rem;
  }

  .review-form label {
    display: grid;
    gap: 0.6rem;
  }

  .review-form label span {
    color: #8a7c70;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .review-form input,
  .review-form textarea {
    width: 100%;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    padding: 1.1rem 1.2rem;
    font: inherit;
    font-size: 1.5rem;
    background: #fffdf9;
    text-transform: none;
  }

  .review-form textarea {
    resize: vertical;
    /* The site-wide textarea style fixes it at 500px. */
    width: 100% !important;
    max-width: none;
  }

  .photo-pick {
    display: flex !important;
    align-items: center;
    gap: 0.8rem;
    border: 1px dashed #d4bfa8;
    border-radius: 1.2rem;
    padding: 1.2rem 1.4rem;
    color: #6b4a2b;
    cursor: pointer;
    font-size: 1.4rem;
  }

  .photo-preview {
    position: relative;
    width: 14rem;
  }

  .photo-preview img {
    width: 100%;
    border-radius: 1.2rem;
    display: block;
  }

  .photo-preview button {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    border: none;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    cursor: pointer;
  }

  .review-error {
    color: #b3261e;
    font-size: 1.35rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .cancel-btn {
    min-height: 4.4rem;
    padding: 0 1.8rem;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    background: #fff;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
  }

  .wall-photos {
    margin-bottom: 2rem;
  }

  .wall-photos h3 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .wall-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1rem;
  }

  .wall-grid img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 1.2rem;
    display: block;
  }

  .review-top .stars {
    flex-shrink: 0;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .review-form {
      padding: 1.4rem;
    }

    .write-btn {
      width: 100%;
    }
  }
`;

export default ProductReviews;
