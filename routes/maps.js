var express = require("express");
var fs = require("fs");
var router = express.Router();
require('dotenv').config();

// Serve the maps page
router.get("/", function (req, res) {
  res.render("maps", { googleApiKey: process.env.GOOGLE_API_KEY });
});

// Handle saving markers
router.post("/save-marker", async function (req, res) {
  const newMarker = req.body;
  const filePath = "public/markers.json";

  fs.readFile(filePath, async (err, data) => {
    let markers = [];
    if (!err) {
      try {
        markers = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).send("Error parsing marker file");
      }
    }

    // Add marker
    markers.push(newMarker);
    fs.writeFile(filePath, JSON.stringify(markers, null, 2), (err) => {
      if (err) return res.status(500).send("Error saving marker");
      res.send("Marker saved!");
    });
  });
});

module.exports = router;
