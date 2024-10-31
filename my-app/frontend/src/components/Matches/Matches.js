import React, { useEffect, useState } from 'react';
import './Matches.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    // Przykładowe dane - tutaj powinno być API
    const exampleMatches = [
      { id: 1, name: 'Mecz 1', date: '2024-10-18', result: 'Wygrana 80-75' },
      { id: 2, name: 'Mecz 2', date: '2024-10-25', result: 'Przegrana 65-70' },
    ];
    setMatches(exampleMatches);
  };

  return (
    <div className="matches-container">
      <h2>Mecze</h2>
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            {match.name} - {match.date} (Wynik: {match.result})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matches;
