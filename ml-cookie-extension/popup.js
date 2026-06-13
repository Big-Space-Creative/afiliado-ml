const WEBHOOK_URL =
  "https://webhooks.bigspacecreative.com.br/webhook/ml-atualizar-cookie";

const ML_DOMAINS = [".mercadolivre.com.br", ".mercadolibre.com"];

const btn = document.getElementById("btn");
const status = document.getElementById("status");

function showStatus(type, msg) {
  status.className = type;
  status.textContent = msg;
}

btn.addEventListener("click", async () => {
  btn.disabled = true;
  showStatus("info", "Coletando cookies...");

  try {
    const allCookies = await Promise.all(
      ML_DOMAINS.map((domain) =>
        chrome.cookies.getAll({ domain })
      )
    );

    const merged = Object.values(
      allCookies
        .flat()
        .reduce((acc, c) => {
          acc[c.name] = c;
          return acc;
        }, {})
    );

    if (merged.length === 0) {
      showStatus("error", "Nenhum cookie encontrado. Faça login no Mercado Livre.");
      btn.disabled = false;
      return;
    }

    const hasSsid = merged.some((c) => c.name === "ssid");
    if (!hasSsid) {
      showStatus("error", "Cookie de sessão não encontrado. Faça login no ML primeiro.");
      btn.disabled = false;
      return;
    }

    const cookieString = merged
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    showStatus("info", "Enviando para o sistema...");

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cookie: cookieString }),
    });

    const data = await res.json();

    if (data.success) {
      showStatus("success", `✅ Cookie sincronizado! (${merged.length} cookies)`);
    } else {
      showStatus("error", "❌ " + (data.error || "Falha ao sincronizar."));
    }
  } catch (err) {
    showStatus("error", "❌ Erro: " + err.message);
  } finally {
    btn.disabled = false;
  }
});
