import React from 'react';
import './Gallery.css';


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

const Gallery = () => {
  return (
    <section className="gallery-section section" style={{ marginTop: '100px' }}>
      <h2>Galeria</h2>
      <div className="gallery-container">
        {images.map((src, index) => (
          <div key={index} className="gallery-item">
            <img src={src} alt={`Zdjęcie z galerii ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
