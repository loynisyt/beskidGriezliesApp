import React, { useEffect, useState } from "react";
import axios from "axios";

const ZlkData = () => {
  const [beskidPlayers, setBeskidPlayers] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/users/proxy/statistics");
          console.log("API Response:", response.data); // Log the response data
          const players = response.data;
      
          if (Array.isArray(players)) {
            const beskid = players.filter(player => player.team === "Beskid Griezlies");
            const others = players.filter(player => player.team !== "Beskid Griezlies");
          
            setBeskidPlayers(beskid);
            setOtherPlayers(others);
          } else {
            console.error("Unexpected data format:", players);
          }
          
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, []);

  if (loading) {
    return <div className="has-text-centered">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="title has-text-centered">Player Statistics</h1>

      <div className="columns">
        {/* Beskid Griezlies Players */}
        <div className="column">
          <h2 className="subtitle">Beskid Griezlies</h2>
          <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {beskidPlayers.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Other Players */}
        <div className="column">
          <h2 className="subtitle">Other Teams</h2>
          <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {otherPlayers.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.team}</td>
                  <td>{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ZlkData;