const express = require("express");
const { setupMiddleware } = require("./api/middleware.js");
const routes = require("./api/routes.js");
const path = require("path");

const app = express();

// Setup middlewares (CORS, body parsing, sessions, static files)
setupMiddleware(app);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Use routes
app.use("/", routes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(3000, () => console.log("Server running on port 3000"));
