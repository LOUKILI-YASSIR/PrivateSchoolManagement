const express = require("express");
const path = require("path");
const { upload } = require("./middleware.js");

const router = express.Router();

// New upload route with optional matricule parameter
router.post("/upload/:tablename/:matricule?", upload.single("fileToUpload"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "File upload failed." });
  }

  // Extract just the filename without any system paths
  const filename = path.basename(req.file.path);
  const tableName = req.params.tablename;
  
  // Return the filename with the table name prefix
  const responseFilename = `${tableName}/${filename}`;

  res.json({
    success: true,
    filename: responseFilename,
    matricule: req.matricule
  });
});

// Existing route for cities
router.get("/ville/:pays", (req, res) => {
  const cities = require("cities.json");
  const countryCode = req.params.pays.toUpperCase();
  const filteredCities = cities.filter(city => 
    city.country.toUpperCase() === countryCode
  );
  console.log(filteredCities);
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