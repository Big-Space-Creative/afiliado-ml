import axios from "axios";

const CATALOG_ID_PATTERN = /\bMLB[A-Z]?\d{6,12}\b/i;
const N8N_SCRAPING_WEBHOOK =
  process.env.N8N_SCRAPING_WEBHOOK_URL ||
  "https://webhooks.bigspacecreative.com.br/webhook/ee9ecc98-daae-44f5-87c3-17bf34b58190";

export async function scrapeProduct(url) {
  const productId = extractMlbId(url);
  if (!productId) {
    throw new Error(
      "ID do produto não encontrado na URL. " +
      "Use a URL da página do produto no Mercado Livre (ex: mercadolivre.com.br/.../p/MLB...)."
    );
  }

  return await fetchProduct(productId, url);
}

export function extractMlbId(input) {
  if (!input) return null;

  // Remove o hash — IDs no fragmento (#) são dados de rastreamento, não o produto
  const withoutHash = input.split("#")[0];

  // Prioriza o ID do path da URL (ignora query string se possível)
  try {
    const { pathname } = new URL(withoutHash);
    const pathMatch = pathname.match(CATALOG_ID_PATTERN);
    if (pathMatch) return pathMatch[0].toUpperCase();
  } catch { /* não é URL válida, tenta direto */ }

  const match = withoutHash.match(CATALOG_ID_PATTERN);
  return match ? match[0].toUpperCase() : null;
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isMercadoLivreUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return /mercadolivre\.com(\.br)?$/.test(parsedUrl.hostname);
  } catch {
    return false;
  }
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function firstDefined(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  );
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeMeliImageUrl(url) {
  if (typeof url !== "string") return null;

  return url
    .replace(/-I\.(jpg|jpeg|png|webp)$/i, "-O.$1")
    .replace(/-V\.(jpg|jpeg|png|webp)$/i, "-O.$1");
}

function uniqueStrings(values) {
  return [
    ...new Set(
      values.filter((value) => typeof value === "string" && value.trim())
    ),
  ];
}

function findSchemaItem(schema, type) {
  return schema.find((item) => item?.["@type"] === type);
}

function extractImages(productSchema) {
  const images = asArray(productSchema?.image)
    .map(normalizeMeliImageUrl)
    .filter(Boolean);

  return uniqueStrings(images);
}

function extractReviews(productSchema) {
  return asArray(productSchema?.review)
    .map((review, index) => ({
      id:
        review?.["@id"] ||
        `${productSchema?.sku || productSchema?.name || "review"}-${index + 1}`,
      author: review?.author?.name || review?.author || null,
      text: review?.reviewBody || null,
      rate: toNumber(review?.reviewRating?.ratingValue),
      date: review?.datePublished || null,
    }))
    .filter((review) => review.text);
}

function extractCategories(schema) {
  const breadcrumb = findSchemaItem(schema, "BreadcrumbList");

  return asArray(breadcrumb?.itemListElement)
    .map((item) => item?.item?.name)
    .filter(Boolean);
}

function extractVariants(json) {
  const variationPayload =
    json.components?.variations ||
    json.components?.variation_selector ||
    json.components?.ui_variations ||
    json.components?.track?.melidata_event?.event_data?.variations;

  return asArray(variationPayload?.variations || variationPayload)
    .map((variant) => ({
      id: variant?.id || variant?.item_id || variant?.value_id || null,
      name: variant?.name || variant?.label || variant?.value_name || null,
      selected: Boolean(variant?.selected),
      available:
        variant?.available !== undefined
          ? variant.available
          : variant?.disabled !== undefined
          ? !variant.disabled
          : null,
      url: variant?.url || variant?.permalink || null,
      image: normalizeMeliImageUrl(
        variant?.picture || variant?.image || variant?.thumbnail
      ),
    }))
    .filter(
      (variant) => variant.id || variant.name || variant.url || variant.image
    );
}

async function fetchProduct(productId, originalUrl) {
  console.log(`[Scraping] Buscando produto: ${productId}`);
  console.log(`[Scraping] Webhook: ${N8N_SCRAPING_WEBHOOK}`);

  const { data: json, status } = await axios.post(
    N8N_SCRAPING_WEBHOOK,
    { product_id: productId },
    {
      timeout: 20000,
      validateStatus: (s) => s < 500,
    }
  );

  console.log(`[Scraping] Status HTTP: ${status}`);
  console.log(`[Scraping] Chaves da resposta: ${Object.keys(json || {}).join(", ") || "(vazio)"}`);

  // Erro de autenticação retornado pelo n8n (cookie expirado)
  if (status === 401 || json?.error) {
    const msg = json?.instrucao || json?.error || "Cookie do Mercado Livre expirado.";
    console.error(`[Scraping] Erro de autenticação: ${msg}`);
    throw new Error(msg);
  }

  // Erro retornado pela própria API do ML (ex: produto não encontrado)
  if (json?.status && json.status !== 200) {
    const msg =
      json.status === 404
        ? `Produto ${productId} não encontrado. Este tipo de URL pode não ser suportado — tente a URL da página de catálogo (/p/MLB...).`
        : json?.displayMessage || `Erro da API do ML (status ${json.status})`;
    console.error(`[Scraping] Erro da API do ML:`, json);
    throw new Error(msg);
  }

  if (!json.schema || !Array.isArray(json.schema) || !json.schema[0]) {
    console.error(`[Scraping] Schema ausente. Resposta:`, JSON.stringify(json).slice(0, 300));
    throw new Error("Dados do produto não encontrados na resposta da API.");
  }

  console.log(`[Scraping] Schema encontrado com ${json.schema.length} item(s).`);

  const productSchema =
    findSchemaItem(json.schema, "Product") || json.schema[0];
  const aggregateRating = productSchema.aggregateRating || {};
  const offers = Array.isArray(productSchema.offers)
    ? productSchema.offers[0]
    : productSchema.offers || {};
  const eventData = json.components?.track?.melidata_event?.event_data || {};
  const reviews = extractReviews(productSchema);
  const images = extractImages(productSchema);
  const rating = toNumber(
    firstDefined(aggregateRating.ratingValue, aggregateRating.rating)
  );
  const ratingCount = toNumber(
    firstDefined(aggregateRating.ratingCount, aggregateRating.reviewCount)
  );

  const product_id = json.id;
  const product_title = productSchema.name;
  const product_image = images[0] || normalizeMeliImageUrl(productSchema.image);
  const product_url = originalUrl;
  const product_rate = rating;
  const product_rateCount = ratingCount;
  const product_price = toNumber(firstDefined(offers.price, eventData.price));
  const product_originalprice = toNumber(eventData.original_price);
  const product_description = productSchema.description;
  const product_review1 = reviews[0]?.text;
  const product_review2 = reviews[1]?.text;
  const product_review3 = reviews[2]?.text;
  const product_brand =
    productSchema.brand?.name || productSchema.brand || null;
  const product_categories = extractCategories(json.schema);
  const product_variants = extractVariants(json);

  const product = {
    id: product_id,
    title: product_title,
    image: product_image,
    image_high_quality: product_image,
    images,
    url: product_url,
    url_afiliado: originalUrl,
    rate: product_rate,
    rateCount: product_rateCount,
    rating: product_rate,
    rating_count: product_rateCount,
    review_count: product_rateCount,
    original_price: product_originalprice,
    price: product_price,
    price_currency: offers.priceCurrency || eventData.currency_id || null,
    availability: offers.availability || null,
    condition: productSchema.itemCondition || eventData.condition || null,
    description: product_description,
    review1: product_review1,
    review2: product_review2,
    review3: product_review3,
    reviews,
    brand: product_brand,
    categories: product_categories,
    variants: product_variants,
  };
  return [product];
}
