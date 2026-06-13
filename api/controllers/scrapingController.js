import {
  isMercadoLivreUrl,
  isValidUrl,
  scrapeProduct as scrapeProductService,
} from "../services/scraping.js";

/**
 * @route GET /api/scrape/scrape
 * @description Realiza o scraping de um produto e retorna os dados
 */
export async function scrapeProductController(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL é necessária",
      message: "Por favor, forneça uma URL válida como parâmetro 'url'",
    });
  }

  if (!isValidUrl(url) || !isMercadoLivreUrl(url)) {
    return res.status(400).json({
      success: false,
      error: "URL inválida",
      message: "A URL deve ser válida e pertencer ao Mercado Livre",
    });
  }

  try {
    const productData = await scrapeProductService(url);

    if (!Array.isArray(productData)) {
      return res.status(502).json({
        success: false,
        error: "Erro ao processar dados de scraping",
      });
    }

    res.json({
      success: true,
      data: productData,
    });
  } catch (error) {
    console.error("Erro no controller de scraping:", error.message);
    res.status(500).json({
      success: false,
      error: "Erro ao acessar o link",
    });
  }
}
