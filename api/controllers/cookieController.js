import axios from "axios";

const N8N_COOKIE_WEBHOOK =
  process.env.N8N_COOKIE_WEBHOOK_URL ||
  "https://webhooks.bigspacecreative.com.br/webhook/ml-atualizar-cookie";

async function sendCookieToN8n(cookieStr) {
  const { data, status } = await axios.post(
    N8N_COOKIE_WEBHOOK,
    { cookie: cookieStr },
    { timeout: 10000, validateStatus: (s) => s < 500 }
  );
  if (status >= 400 || !data?.success) {
    throw new Error(data?.error || "Falha ao atualizar cookie no n8n");
  }
}

export async function updateMlCookie(req, res) {
  const { cookie } = req.body;

  if (!cookie || typeof cookie !== "string" || !cookie.trim()) {
    return res.status(400).json({ success: false, error: "Cookie é obrigatório" });
  }

  try {
    await sendCookieToN8n(cookie.trim());
    return res.json({ success: true, message: "Cookie atualizado com sucesso" });
  } catch (error) {
    console.error("[Cookie] Erro ao atualizar:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
