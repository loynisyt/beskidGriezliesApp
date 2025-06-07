import React, { useEffect, useState } from "react";

const MatchModal = ({ matchUrl, onClose }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!matchUrl) return;
    setDetails(null);
    fetch(`/api/zlk/match-details?url=${encodeURIComponent(matchUrl)}`)
      .then((res) => res.json())
      .then(setDetails)
      .catch(() => setDetails(null));
  }, [matchUrl]);

  if (!matchUrl) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          {!details ? (
            <div>Ładowanie szczegółów meczu...</div>
          ) : (
            <>
              <h3 className="title is-4">
                {details.teams?.join(" vs ")} NA RAZIE DANE NIEDOSTEPNE{" "}
              </h3>
              <p>
                <strong>Wynik:</strong> {details.score}
              </p>
              <p>
                <strong>Data:</strong> {details.date}
              </p>
              {details.quarters && details.quarters.length > 0 && (
                <div>
                  <strong>Punkty na kwartę:</strong>
                  <ul>
                    {details.quarters.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
              {details.statsTable && details.statsTable.length > 0 && (
                <table className="table is-fullwidth is-striped">
                  <tbody>
                    {details.statsTable.map((row, idx) => (
                      <tr key={idx}>
                        {row.map((cell, i) => (
                          <td key={i}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
          <button className="button mt-3" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default MatchModal;
