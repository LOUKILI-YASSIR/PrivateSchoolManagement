const express = require("express");
const { setupMiddleware } = require("./api/middleware.js");
const routes = require("./api/routes.js");

const app = express();

// Setup middlewares (CORS, body parsing, sessions, static files)
setupMiddleware(app);

// Use routes
app.use("/", routes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(3000, () => console.log("Server running on port 3000"));
