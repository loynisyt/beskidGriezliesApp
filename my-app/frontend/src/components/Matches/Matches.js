// src/components/Matches/Matches.js
import React, { useEffect, useState } from 'react';
import './Matches.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    // In a real application, you would fetch this data from your API
    // For now, we'll use example data
    const exampleMatches = [
      { id: 1, opponent: 'City Sharks', date: '2023-06-20', time: '19:00', location: 'Home Arena', result: 'Pending' },
      { id: 2, opponent: 'Mountain Lions', date: '2023-06-27', time: '20:00', location: 'Away Stadium', result: 'Pending' },
      { id: 3, opponent: 'River Raptors', date: '2023-07-05', time: '18:30', location: 'Home Arena', result: 'Won 78-72' },
    ];
    setMatches(exampleMatches);
  };

  return (
    <div className="container">
      <h2 className="title is-2 has-text-centered my-5">Matches</h2>
      <div className="columns is-multiline">
        {matches.map(match => (
          <div key={match.id} className="column is-half">
            <div className="box has-background-primary-light">
              <article className="media">
                <div className="media-left">
                  <figure className="image is-64x64">
                    <img src="/path-to-basketball-icon.png" alt="Basketball icon" />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="content">
                    <p>
                      <strong>vs {match.opponent}</strong> 
                      <br />
                      <small>{match.date} at {match.time}</small>
                      <br />
                      Location: {match.location}
                      <br />
                      Result: <span className={`tag ${match.result === 'Pending' ? 'is-warning' : 'is-success'}`}>{match.result}</span>
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;