import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="aboutus-section">
      <h2>O Nas</h2>
      <p>
        Jesteśmy amatorską drużyną koszykówki grającą w Żywieckiej Lidze Koszykówki od ponad 3 lat. Stawiamy na chęci nauki i rozwoju, cenimy umiejętności indywidualne, ale także drużynowe.
      </p>
      <hr />
      <p>
        Prowadzimy aktywne treningi oraz gramy mecze sparingowe i ligowe. Naszym celem jest ciągłe doskonalenie się i wspieranie ducha zespołu. Wierzymy, że sport to nie tylko rywalizacja, ale także przyjaźń i wspólnota.
      </p>
      <hr />
      <p>
        Działamy na rejonach Suchej Beskidzkiej i okolic, ale zapraszamy wszystkich chętnych do kontaktu i dołączenia do naszej drużyny. Jesteśmy otwarci na nowych członków, którzy chcą rozwijać swoją pasję do koszykówki.
      </p>
      <hr />
      <p>
        Zapraszamy wszystkich chętnych do dołączenia do naszej drużyny i wspólnego rozwijania pasji do koszykówki.
      </p>
      <div className="aboutus-gallery">
        <img src="/photo1.jpg" alt="Mecz 1" />
        <img src="/photo2.jpg" alt="Mecz 2" />
        <img src="/photo3.jpg" alt="Mecz 3" />
        <img src="/photo4.jpg" alt="Mecz 4" />
        <img src="/photo5.jpg" alt="Mecz 5" />
      </div>
    </section>
  );
};

export default AboutUs;
