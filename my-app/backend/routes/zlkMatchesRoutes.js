const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const STANDINGS_URL = 'https://zlkosz.pl/tournament/sezon-4/regular-season/';

function parseStandings($) {
  const standings = [];
  let rows = $('table.standings-table tbody tr');
  if (rows.length === 0) rows = $('table tbody tr');

  rows.each((i, el) => {
    const tds = $(el).find('td');
    if (tds.length >= 10) {
      const teamCell = $(tds[1]).text().trim();
      const match = teamCell.match(/^(.+?)\s+((?:[WP]\s*)+)$/i);
      let teamName = teamCell;
      let streakArr = [];
      if (match) {
        teamName = match[1].trim();
        streakArr = match[2].trim().split(/\s+/);
      } else {
        streakArr = $(tds[2]).text().trim().split(/\s+/);
      }
      // Zawsze 5 ostatnich, puste jeśli mniej
      while (streakArr.length < 5) streakArr.unshift("");
      if (streakArr.length > 5) streakArr = streakArr.slice(-5);
      const matches_amount = $(tds[2]).text().trim();
      const matches = Number($(tds[3]).text().trim());
      const wins = Number($(tds[4]).text().trim());
      const losses = Number($(tds[5]).text().trim());
      const scored = Number($(tds[6]).text().trim());
      const conceded = Number($(tds[7]).text().trim());
      // Procent wygranych (0-1, zaokrąglony do 3 miejsc)
      let percent = (matches / matches_amount).toFixed(3);
      if (isNaN(percent)) percent = '0.000'; // Jeśli brak meczów, ustaw 0.000
      // Punkty: 2 za wygraną, 1 za przegraną
      let points = 0 + (matches * 2) + wins;

      standings.push({
        id: i + 1,
        team: teamName,
        streak: streakArr,
        matches_amount: matches_amount,
        matches: matches,
        wins: wins,
        losses: losses,
        scored: scored,
        conceded: conceded,
        percent: percent,
        points: points,
      });
    }
  });
  return standings;
}
//KONIEC FUNKCJI PARSUJACYCH I WSPOMAGAJACYCH






// Endpoint: cała tabela (do rozwoju, np. do fetchowania detali meczu)
router.get('/standings', async (req, res) => {
  try {
    const response = await axios.get(STANDINGS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);
    const standings = parseStandings($);
    res.json(standings);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping standings' });
  }
});

// Endpoint: tylko liga (id <= 8)
router.get('/standings/league', async (req, res) => {
  try {
    const response = await axios.get(STANDINGS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);
    let standings = parseStandings($);
    standings = standings.filter(row => row.id <= 8);
    res.json(standings);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping league standings' });
  }
});

// Endpoint: tylko juniorzy (id > 8)
router.get('/standings/junior', async (req, res) => {
  try {
    const response = await axios.get(STANDINGS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);
    let standings = parseStandings($);
    standings = standings.filter(row => row.id > 8);
    res.json(standings);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping junior standings' });
  }
});





// Endpoint: bloki gier (ostatnie wyniki i nadchodzące mecze)
router.get('/games-blocks', async (req, res) => {
  const { category = "regular-season" } = req.query;
  let url = "https://zlkosz.pl/tournament/sezon-4/";
  if (category === "playoffs") url += "playoffs/";
  else if (category === "playoffs-1-liga") url += "playoffs-1-liga/";
  else if (category === "all") url = "https://zlkosz.pl/tournament/sezon-4/";
  else url += "regular-season/";

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(response.data);

    const allGames = [];
$('.list-group-item.tournament__game').each((i, el) => {
  const $el = $(el);

  const date = $el.find('.game-list__date').text().trim();
  const time = $el.find('.game-list__time-formatted').text().trim();

  const team1 = $el.find('.col-6.ps-0 .px-2.py-1.fw-bold').text().trim();
  const team2 = $el.find('.col-6.text-start.pe-0 .px-2.py-1.fw-bold').text().trim();

  let score1 = $el.find('.col-6.ps-0 .score .text-white').text().trim();
  let score2 = $el.find('.col-6.text-start.pe-0 .score .text-white').text().trim();
  let score = "";
  if (score1 && score2) {
    score = `${score1} : ${score2}`;
  }

  let detailsUrl = $el.find('a.stretched-link').attr('href');
  if (detailsUrl && !detailsUrl.startsWith('http')) {
    detailsUrl = `https://zlkosz.pl${detailsUrl}`;
  }

  // Sprawdź czy mecz jest w przyszłości
  let isUpcoming = false;
  if (!score1 || !score2 || score1 === "-" || score2 === "-" || score === "- : -" || score === "--") {
    isUpcoming = true;
  } else if (date) {
    // Format daty: "8 cze 2025" lub "2025-06-08"
    let matchDate = date;
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      matchDate = date;
    } else {
      // Zamień "8 cze 2025" na "2025-06-08"
      const months = { sty: "01", lut: "02", mar: "03", kwi: "04", maj: "05", cze: "06", lip: "07", sie: "08", wrz: "09", paź: "10", lis: "11", gru: "12" };
      const m = date.match(/^(\d{1,2}) (\w{3}) (\d{4})$/);
      if (m) matchDate = `${m[3]}-${months[m[2]]}-${m[1].padStart(2, "0")}`;
    }
    const today = new Date();
    const match = new Date(matchDate);
    if (match > today) isUpcoming = true;
  }

  allGames.push({
    date,
    time,
    team1,
    team2,
    score: isUpcoming ? "--" : score,
    detailsUrl: detailsUrl || null,
    isUpcoming,
  });
});

const lastResults = allGames.filter(g => !g.isUpcoming);
const upcoming = allGames.filter(g => g.isUpcoming);

res.json({ lastResults, upcoming, all: allGames });
  } catch (error) {
    res.status(500).json({ message: 'Error scraping games blocks' });
  }
});

// Endpoint: szczegóły meczu (modal)
router.get('/match-details', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'Missing url param' });

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const teams = $('.game-header .team-name').map((i, el) => $(el).text().trim()).get();
    const score = $('.game-header .score').text().trim();
    const date = $('.game-header .date').text().trim();

    const quarters = [];
    $('.quarters-table tr').each((i, el) => {
      quarters.push($(el).text().trim());
    });

    const statsTable = [];
    $('table.stats-table tbody tr').each((i, el) => {
      const tds = $(el).find('td');
      statsTable.push(tds.map((i, td) => $(td).text().trim()).get());
    });

    res.json({
      teams,
      score,
      date,
      quarters,
      statsTable,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error scraping match details' });
  }
});

module.exports = router;

