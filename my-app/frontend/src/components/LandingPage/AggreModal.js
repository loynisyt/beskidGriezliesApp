import React from "react";
import "./AggreModal.css"; // Optional: Add custom styling for the modal

const AggreModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Wyrażanie zgody</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
    <p>  Zgoda na przetwarzanie danych osobowych i publikację wizerunku
Poprzez zaznaczenie poniższego pola oświadczam, że:</p> 

<p>
Wyrażam zgodę na przetwarzanie moich danych osobowych w celu utworzenia i utrzymywania profilu zawodnika drużyny Beskid Grizzlies, zgodnie z przepisami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
</p>
<p>
- Potwierdzam prawdziwość oraz poprawność przekazanych przeze mnie danych.
</p>
<p>
- Wyrażam zgodę na przesłanie moich danych na adres e-mail: kubawrobel49@gmail.com. Dane te nie będą przetwarzane, udostępniane ani wykorzystywane w żadnym innym celu ani przez inne podmioty poza wymienionym adresem e-mail.
</p>

<p>
- Jestem świadomy/świadoma, że wraz z dołączeniem do drużyny akceptuję możliwość publikacji mojego wizerunku (np. zdjęcia, nagrania wideo) na potrzeby rozwoju strony internetowej, aplikacji oraz profilu klubowego Beskid Grizzlies w mediach społecznościowych.
</p>


        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onConfirm}>
            Zgadzam sie
          </button>
          <button className="button" onClick={onClose}>
            Nie zgadzam się
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AggreModal;