const express = require("express");
const router = express.Router();

// Altere para registrar as rotas diretamente em /api
router.use("/", require("./scraping"));

module.exports = router;
