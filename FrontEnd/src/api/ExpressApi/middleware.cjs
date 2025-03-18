const express = require("express");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");

// Define a mapping for table names to their codes
const codeMapping = {
  etudiants: 'ET',
  professeurs: 'PR'
  // Add other mappings as needed
};
const MaxNbrLength = {
  etudiants: 5,
  professeurs: 3
  // Add other mappings as needed
};

// Setup common middlewares
const setupMiddleware = (app) => {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 600,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  }));

  // Serve uploaded files from /uploads
  app.use("/uploads", express.static(path.join(__dirname, "../../../public/uploads")));
};

// Simple sanitize function (allows only alphanumerics)
const sanitize = (name) => name.replace(/[^a-zA-Z0-9_]/g, '');

// Configure multer storage with dynamic destination folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = path.join(__dirname, '../../../public/uploads');
    const tableName = sanitize(req.params.tablename) || 'default';
    // Always use the table folder as the upload destination.
    const uploadDir = path.join(baseDir, tableName);
    fs.mkdirSync(uploadDir, { recursive: true });
    
    // If matricule is provided in URL, use it; otherwise, generate it.
    if (req.params.matricule) {
      req.matricule = sanitize(req.params.matricule);
      cb(null, uploadDir);
    } else {
      axios.get(`http://localhost:8000/api/${tableName}/count`)
        .then(response => {
          const count = response.data.count || 0;
          const currentYear = new Date().getFullYear();
          const matricule = `YLSCHOOL_${codeMapping[tableName]}_${currentYear}_${String(count + 1).padStart(MaxNbrLength[tableName], '0')}`
          
          req.matricule = matricule;
          cb(null, uploadDir);
        })
        .catch(err => {
          cb(err);
        });
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Use the generated (or provided) matricule as the file name.
    const matricule = req.matricule || 'default';
    cb(null, `${matricule}${ext}`);
  }
});




const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedTypes.test(file.mimetype);
    if (extValid && mimeValid) return cb(null, true);
    cb(new Error('Only images (JPEG, JPG, PNG) are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
});

module.exports = { setupMiddleware, upload };
