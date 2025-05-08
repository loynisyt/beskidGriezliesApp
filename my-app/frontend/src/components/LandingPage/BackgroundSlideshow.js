import React, { useState, useEffect } from 'react';
import './BackgroundSlideshow.css';

const images = [
  '/photo1.jpg',
  '/photo2.jpg',
  '/photo3.jpg',
  '/photo4.jpg',
  '/photo5.jpg',
  '/photo6.jpg',
  '/photo7.jpg',
  '/photo9.jpg',
  '/photo10.jpg',
  '/photo11.jpg',
];

const BackgroundSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 8000); // change image every 8 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="background-slideshow">
      {images.map((src, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
};

export default BackgroundSlideshow;
