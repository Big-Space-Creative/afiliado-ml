const express = require("express");
const router = express.Router();
const scrapingController = require("../controllers/scrapingController");

/**
 * GET /api/scrape
 * Realiza o scraping de um produto
 * Query params:
 *   - url (required): URL do produto a fazer scraping
 *
 * Exemplo:
 *   GET /api/scrape?url=https://www.mercadolivre.com.br/...
 *   ?url={link do mercado livre}
 */
router.get("/scrape", scrapingController.scrapeProduct);

module.exports = router;
