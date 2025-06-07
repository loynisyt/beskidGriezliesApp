const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

//endpoint: pobranie statystyk graczy
router.get("/players", async (req, res) => {
  console.log("GET /api/statistics/players called");

  try {
    const stat = req.query.stat || "";
    const total = req.query.total || "false";

    const url =
      "https://ligazlk.bieda.it/statistics?stat=" +
      encodeURIComponent(stat) +
      "&total=" +
      encodeURIComponent(total);

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const players = [];

    // Scrape the player statistics table
    // The table has rows with player data; adjust selectors as needed
    $("table tbody tr").each((index, element) => {
      const tds = $(element).find("td");
      if (tds.length >= 3) {
        const player = {
          rank: $(tds[0]).text().trim(),
          name: $(tds[1]).text().trim(),
          statValue: $(tds[2]).text().trim(),
        };
        players.push(player);
      }
    });

    res.json(players);
  } catch (error) {
    console.error("Error scraping player statistics:", error.message);
    res.status(500).json({ message: "Error scraping player statistics" });
  }
});

module.exports = router;
