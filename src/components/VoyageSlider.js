import React, { useState, useEffect } from "react";
import "./VoyageSlider.css";

const slides = [
  {
    image: "images/optimusprime.jpg",
    heading: "Discover the World",
    description: "Explore amazing places with us."
  },
  {
    image: "images/optimusprime.jpg",
    heading: "Adventure Awaits",
    description: "Find new adventures around every corner."
  },
  {
    image: "images/optimusprime.jpg",
    heading: "Travel in Comfort",
    description: "Enjoy luxury and convenience."
  }
];

const VoyageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSlideState = (index) => {
    if (index === current) return "active";
    if (index === (current + 1) % slides.length) return "next";
    if (index === (current - 1 + slides.length) % slides.length) return "prev";
    return "inactive";
  };

  return (
    <div className="voyage__slider">
      {slides.map((slide, index) => {
        const state = getSlideState(index);
        return (
          <div
            key={index}
            className={`voyage__slide voyage__slide--${state}`}
          >
            <div className="voyage__image">
              <img src={slide.image} alt={`Slide ${index + 1}`} />
            </div>
            <div className="voyage__text">
              <h2>{slide.heading}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VoyageSlider;