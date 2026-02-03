const axios = require("axios");
const cheerio = require("cheerio");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ACCEPT_LANGUAGE = "pt-BR,pt;q=0.9";

/**
 * Realiza o web scraping de um URL
 * @param {string} url - URL do produto a fazer scraping
 * @returns {Promise<Object>} Dados do produto extraídos
 */
async function scrapeProduct(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": ACCEPT_LANGUAGE,
      },
    });

    const $ = cheerio.load(data);

    // Extrai o preço
    const price = extractPrice($);

    // Extrai o preço original
    const original_price = extractOriginalPrice($);

    // Monta o resultado
    const result = {
      product_name: $(".ui-pdp-title").text().trim() || "N/A",
      original_price: original_price,
      price: price,
      description:
        $(".ui-pdp-description__content").text().trim() ||
        "Sem descrição disponível",
      main_image: $('meta[property="og:image"]').attr("content"),
      link_original: `${url}`,
    };

    return result;
  } catch (error) {
    throw new Error(`Erro ao fazer scraping: ${error.message}`);
  }
}

/**
 * Extrai o preço atual do produto
 * @param {Object} $ - Instância do Cheerio
 * @returns {string|null} Preço formatado ou null
 */
function extractPrice($) {
  let price = null;

  // Busca pelo preço com desconto (atual) dentro da div#price
  const priceDiv = $("#price");
  // Busca o meta[itemprop=price] dentro da div#price
  const metaPrice = priceDiv.find('meta[itemprop="price"]').attr("content");
  if (metaPrice) {
    price = `R$ ${metaPrice.replace(".", ",")}`;
    return price;
  }
  // Busca o valor fracionado (ex: 4.749)
  const fraction = priceDiv
    .find(".andes-money-amount__fraction")
    .first()
    .text();
  // Busca os centavos (ex: 05)
  const cents = priceDiv.find(".andes-money-amount__cents").first().text();
  if (fraction) {
    price = `R$ ${fraction}${cents ? "," + cents : ",00"}`;
  }
  return price;
}

/**
 * Extrai o preço original (antes do desconto)
 * @param {Object} $ - Instância do Cheerio
 * @returns {string|null} Preço original formatado ou null
 */
function extractOriginalPrice($) {
  let original_price = null;

  // Busca pelo preço original (sem desconto) dentro da div#price
  // Seleciona o <s> com as classes de preço anterior dentro da div#price
  const originalPriceEl = $("#price s.ui-pdp-price__original-value");
  if (originalPriceEl.length) {
    const oldFraction = originalPriceEl
      .find(".andes-money-amount__fraction")
      .text();
    const oldCents = originalPriceEl.find(".andes-money-amount__cents").text();
    if (oldFraction) {
      original_price = `R$ ${oldFraction}${oldCents ? "," + oldCents : ",00"}`;
    }
  }
  return original_price;
}

module.exports = {
  scrapeProduct,
  extractPrice,
  extractOriginalPrice,
};
