import React, { useEffect, useState } from "react";
import axios from "axios";

const STAT_OPTIONS = [
  "Punkty",
  "Wszystkie zbiorki",
  "Ofensywne Zbiorki",
  "Defensywne Zbiorki",
  "asysty",
  "3PA",
  "3PM",
  "3P%",
  "2PA",
  "2PM",
  "2P%",
  "1PA",
  "1PM",
  "1P%",
];

const ZlkData = () => {
  const [players, setPlayers] = useState([]);
  const [stat, setStat] = useState("POINTS");
  const [total, setTotal] = useState("false");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/statistics/players?stat=${stat}&total=${total}`)
        setPlayers(response.data);
      } catch (error) {
        setPlayers([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stat, total]);

  return (
    <div className="container">
      <h1 className="title has-text-centered">Player Statistics</h1>

      <div className="buttons is-centered mb-4">
        {STAT_OPTIONS.map((s) => (
          <button
            key={s}
            className={"button " + (stat === s ? "is-primary" : "")}
            onClick={() => setStat(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="buttons is-centered mb-4">
        <button
          className={"button " + (total === "true" ? "is-primary" : "")}
          onClick={() => setTotal("true")}
        >
          Sum
        </button>
        <button
          className={"button " + (total === "false" ? "is-primary" : "")}
          onClick={() => setTotal("false")}
        >
          Average
        </button>
      </div>

      {loading ? (
        <div className="has-text-centered">Loading...</div>
      ) : players.length === 0 ? (
        <div className="has-text-centered">No data available.</div>
      ) : (
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>{stat}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index}>
                <td>{player.rank}</td>
                <td>{player.name}</td>
                <td>{player.statValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ZlkData;