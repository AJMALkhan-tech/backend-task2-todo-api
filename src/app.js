const express = require("express");
const { port } = require("./config/config");
const logger = require("./middleware/logger");
const rateLimiter = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(logger);
app.use(rateLimiter);

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});