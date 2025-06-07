import React, { useEffect, useState } from "react";
import MatchModal from "./MatchModal";
import "./ZlkStandings.css";

const TABS = [
  { label: "Liga", value: "league" },
  { label: "Juniorzy", value: "junior" },
];

const GAME_CATEGORIES = [
  { label: "Wszystko", value: "all" },
  { label: "Regular Season - 1 Liga", value: "regular-season" },
  { label: "Playoffs Mlodziezowka", value: "playoffs" },
  { label: "Playoffs 1 Liga", value: "playoffs-1-liga" },
];

const WLSquare = ({ result }) => (
  <span
    className={
      "tag" +
      (result === "W" ? " is-success" : result === "P" ? " is-danger" : "")
    }
    title={result === "W" ? "Wygrana" : result === "P" ? "Przegrana" : ""}
  >
    {result}
  </span>
);

const Matches = () => {
  const [tab, setTab] = useState("league");
  const [standings, setStandings] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  // Bloczki meczów
  const [gameCategory, setGameCategory] = useState("regular-season");
  const [gamesBlocks, setGamesBlocks] = useState({
    lastResults: [],
    upcoming: [],
  });
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const [selectedMatchUrl, setSelectedMatchUrl] = useState(null);

  useEffect(() => {
    setLoadingTable(true);
    fetch(`/api/zlk/standings/${tab}`)
      .then((r) => r.json())
      .then(setStandings)
      .finally(() => setLoadingTable(false));
  }, [tab]);

  useEffect(() => {
    setLoadingBlocks(true);
    fetch(`/api/zlk/games-blocks?category=${gameCategory}`)
      .then((r) => r.json())
      .then(setGamesBlocks)
      .finally(() => setLoadingBlocks(false));
  }, [gameCategory]);

  return (
    <div className="container">
      <div className="buttons is-centered mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={`button ${tab === t.value ? "is-primary" : ""}`}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <h2 className="title is-3 has-text-centered">
        Tabela - {tab === "league" ? "ŻLK Sezon 4" : "MPWiK 2 liga - Juniorzy"}
      </h2>
      {loadingTable ? (
        <div className="has-text-centered">Ładowanie tabeli...</div>
      ) : (
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>#</th>
              <th>Zespół</th>
              <th>KDA</th>
              <th>M</th>
              <th>W</th>
              <th>P</th>
              <th>Pkt Zdobyte</th>
              <th>Pkt Stracone</th>
              <th>Różnica</th>
              <th>%</th>
              <th>Pkt</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => (
              <tr key={team.id}>
                <td>{idx + 1}</td>
                <td>{team.team}</td>
                <td>
                  {(team.streak || []).map((r, i) => (
                    <WLSquare key={i} result={r} />
                  ))}
                </td>
                <td>{team.matches}</td>
                <td>{team.wins}</td>
                <td>{team.losses}</td>
                <td>{team.scored}</td>
                <td>{team.conceded}</td>
                <td>{team.diff}</td>
                <td>{team.percent}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bloczki meczów */}
      <div className="buttons is-centered mt-5 mb-2">
        {GAME_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`button ${
              gameCategory === cat.value ? "is-primary" : ""
            }`}
            onClick={() => setGameCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <h3 className="title is-4">Mecze</h3>
      {loadingBlocks ? (
        <div className="has-text-centered">Ładowanie meczów...</div>
      ) : (
        <div className="columns">
          <div className="column">
            <h4 className="subtitle is-5">Ostatnie wyniki</h4>
            {gameCategory === "all"
              ? gamesBlocks.all.filter((g) => !g.isUpcoming).length === 0 && (
                  <div>Brak danych</div>
                )
              : gamesBlocks.lastResults.length === 0 && <div>Brak danych</div>}
            {(gameCategory === "all"
              ? gamesBlocks.all.filter((g) => !g.isUpcoming)
              : gamesBlocks.lastResults
            ).map((g, i) => (
              <div
                key={i}
                className="box mb-2 zlk-match-box"
                style={{ cursor: g.detailsUrl ? "pointer" : "default" }}
                onClick={() =>
                  g.detailsUrl && setSelectedMatchUrl(g.detailsUrl)
                }
              >
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <span className="has-text-weight-bold">{g.team1}</span>
                    <span className="mx-2">vs</span>
                    <span className="has-text-weight-bold">{g.team2}</span>
                  </div>
                  <div className="has-text-grey" style={{ fontSize: 14 }}>
                    {g.date}{" "}
                    {g.time && <span style={{ marginLeft: 8 }}>{g.time}</span>}
                  </div>
                </div>
                <div
                  className="tag is-info has-text-centered mt-2"
                  style={{ fontSize: 18 }}
                >
                  <span className="is-large">{g.score}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="column">
            <h4 className="subtitle is-5">Nadchodzące mecze</h4>
            {gameCategory === "all"
              ? gamesBlocks.all.filter((g) => g.isUpcoming).length === 0 && (
                  <div>Brak danych</div>
                )
              : gamesBlocks.upcoming.length === 0 && <div>Brak danych</div>}
            {(gameCategory === "all"
              ? gamesBlocks.all.filter((g) => g.isUpcoming)
              : gamesBlocks.upcoming
            ).map((g, i) => (
              <div
                key={i}
                className="box mb-2 zlk-match-box"
                style={{ cursor: g.detailsUrl ? "pointer" : "default" }}
                onClick={() =>
                  g.detailsUrl && setSelectedMatchUrl(g.detailsUrl)
                }
              >
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <span className="has-text-weight-bold">{g.team1}</span>
                    <span className="mx-2">vs</span>
                    <span className="has-text-weight-bold">{g.team2}</span>
                  </div>
                  <div className="has-text-grey" style={{ fontSize: 14 }}>
                    {g.date}{" "}
                    {g.time && <span style={{ marginLeft: 8 }}>{g.time}</span>}
                  </div>
                </div>
                <div
                  className=" tag is-warning has-text-centered mt-2"
                  style={{ fontSize: 18 }}
                >
                  <span className=" is-large">- : -</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedMatchUrl && (
        <MatchModal
          matchUrl={selectedMatchUrl}
          onClose={() => setSelectedMatchUrl(null)}
        />
      )}
    </div>
  );
};

export default Matches;
