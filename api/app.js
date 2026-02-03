const express = require("express");
require("dotenv").config();
const cors = require("cors");

// Importa as rotas
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", routes);

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API está funcionando" });
});

const PORT = process.env.PORT || "3000";

app.listen(PORT, () => {
  console.log(`API On! Servidor rodando em http://localhost:${PORT}`);
});
