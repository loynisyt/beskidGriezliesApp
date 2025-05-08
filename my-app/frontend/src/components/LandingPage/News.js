import React, { useState, useEffect, useRef } from "react";

import './News.css';

const News = () => {
  const [logoSrc, setLogoSrc] = useState("/oldLogo.png");
  const [fade, setFade] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start animation when image is visible
          setFade(true);
          setTimeout(() => {
            
            setLogoSrc("/beskid-griezlies-logo.png");
          }, 1500); // fade out duration

          setTimeout(() => {
            setFade(false);
            // Keep the new logo visible after animation
            setLogoSrc("/beskid-griezlies-logo.png");
          }, 1500);

        
          
        } 
        else {
          // Reset animation when not visible
          setFade(false);
          setLogoSrc("/oldLogo.png");
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    observerRef.current.observe(imgElement);

    return () => {
      if (observerRef.current && imgElement) {
        observerRef.current.unobserve(imgElement);
      }
    };
  }, []);

  return (
    <div className="news-container">
      <section className="news-section section" style={{}}>
        <h2 className="title">Początek - Rebranding</h2>
        <p>Rebranding drużyny Patobasket na Beskid Griezlies</p>
        <p>
          W dniu 5.04.2024 drużyna Patobasket ogłosiła rebranding na Beskid
          Griezlies. Nowa nazwa i logo odzwierciedlają naszą pasję do
          koszykówki i ducha drużyny.
        </p>


        <div className="logo-transition-container mr-5">
          <img
            ref={imgRef}
            src={logoSrc}
            alt="Team Logo"
            className={`logo-image ${fade ? "fade" : ""}`}
          />
        </div>
      </section>



      <section className="news-section section" style={{}}>
  <h2 className="title ">Pierwsze wspólne zdjęcie naszych walecznych misiów przed I kolejką II sezonu ŻLK</h2>
       <div>
        <img src="/teamPhoto.jpg" alt="Beskid Griezlies" className='img-fluid team-photo' />
       </div>
      </section>


      <section className="news-section section" style={{}}>
  <h2 className="title ">Pierwsza Wygrana Misiów</h2>

  <p> Beskid Grizzlies wygrywa swój pierwszy mecz w sezonie przeciwko Basket Crew z wynikiem 51:41 </p>
       <div>
        <img src="/win.jpg" alt="Beskid Griezlies" className='img-fluid team-photo' />
       </div>
      </section>




    </div>
  );
};

export default News;
