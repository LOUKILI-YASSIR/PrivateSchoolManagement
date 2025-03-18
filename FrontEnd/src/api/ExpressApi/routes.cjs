const express = require("express");
const path = require("path");
const { upload } = require("./middleware.cjs");
const cities = require("cities.json");

const router = express.Router();

// New upload route with optional matricule parameter
router.post("/upload/:tablename/:matricule?", upload.single("fileToUpload"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File upload failed." });
  }

  const publicDir = path.join(__dirname, "../../../public");
  let relativePath = req.file.path.replace(publicDir, "");
  relativePath = relativePath.split(path.sep).join('/');

  res.json({
    success: true,
    filename: relativePath,
    matricule: req.matricule
  });
});

// Existing route for cities
router.get("/ville/:pays", (req, res) => {
  const countryCode = req.params.pays.toUpperCase();
  const filteredCities = cities.filter(city => 
    city.country.toUpperCase() === countryCode
  );

  if (!filteredCities.length) {
    return res.status(200).json({
      success: false,
      message: "Aucune ville trouvée",
      cities: []
    });
  }

  res.json({
    success: true,
    cities: filteredCities.map(city => city.name)
  });
});

module.exports = router;