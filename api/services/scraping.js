import axios from "axios";

const PRODUCT_ID_PATTERN = /MLB\d+/i;

export async function scrapeProduct(url) {
  const url_original = url;
  const product_id_match = url_original.match(PRODUCT_ID_PATTERN);
  if (!product_id_match || !product_id_match[0]) {
    throw new Error("ID do produto não encontrado na URL.");
  }
  const formatted_id = product_id_match[0].toUpperCase();
  const url_api = `https://www.mercadolivre.com.br/p/api/deferred?id=${formatted_id}&app=pdp&component_ids=open_box_alternatives&allow_test_items=false`;
  return await fetchAndSave(url_api, url);
}

const client = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9",
    Referer: "https://www.mercadolivre.com.br/",
    Cookie: process.env.COOKIE_CLIENT || "",
  },
  timeout: 15000,
});

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

async function fetchAndSave(url, original_url) {
  const url_af = url;
  const response = await client.get(url);
  const products = [];

  const json =
    typeof response.data === "string"
      ? JSON.parse(response.data)
      : response.data;

  if (!json.schema || !Array.isArray(json.schema) || !json.schema[0]) {
    throw new Error("Dados do produto não encontrados na resposta da API.");
  }

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
  const product_url = original_url;
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
    url_afiliado: url_af,
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
  products.push(product);
  const formatted = JSON.stringify(products, null, 2);

  return formatted;
}
