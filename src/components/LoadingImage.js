import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

// An <img> that shows a shimmering poster placeholder until it has loaded, then
// fades and un-blurs into view. By default the placeholder is an overlay that fills
// the nearest positioned parent; pass overlay={false} for images that already have
// their own box, and the shimmer is painted on the image itself.
const LoadingImage = forwardRef(({ className = "", overlay = true, onLoad, onError, src, alt = "", ...props }, ref) => {
  const imgRef = useRef(null);
  // "loading" | "revealing" (just finished, play the fade-in) | "ready" (was cached).
  const [state, setState] = useState("loading");

  const setRefs = useCallback(
    (node) => {
      imgRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  useEffect(() => {
    const img = imgRef.current;
    // Cached images are already complete on mount: show them without the animation.
    setState(img && img.complete && img.naturalWidth ? "ready" : "loading");
  }, [src]);

  const finish = (event, handler) => {
    setState((current) => (current === "loading" ? "revealing" : current));
    if (handler) handler(event);
  };

  const loading = state === "loading";
  const classes = [className, "pt-img", `is-${state}`, overlay ? "" : "pt-img--self"].filter(Boolean).join(" ");

  return (
    <>
      <img
        ref={setRefs}
        src={src}
        alt={alt}
        className={classes}
        onLoad={(event) => finish(event, onLoad)}
        onError={(event) => finish(event, onError)}
        {...props}
      />
      {overlay && loading && (
        <span className="pt-img-loader" aria-hidden="true">
          <span className="pt-img-loader-poster" />
        </span>
      )}
    </>
  );
});

export default LoadingImage;
