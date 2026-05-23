import express from "express";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import routes from "./routes/index.js";
import { priceUpdateService } from "./services/priceUpdateService.js";

const __appDir = dirname(fileURLToPath(import.meta.url));

// Carrega as variáveis do arquivo .env raiz (se houver) e depois da subpasta api
configDotenv({ path: join(__appDir, "..", ".env") });
configDotenv({ path: join(__appDir, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API está funcionando" });
});

// Serve arquivos estáticos do cliente Vue (produção)
const publicDir = join(__appDir, "public");
if (existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // Fallback para Vue Router (HTML5 history mode)
  app.get("*all", (req, res) => {
    res.sendFile(join(publicDir, "index.html"));
  });
}

const PORT = process.env.PORT || "3000";

// Intervalo de atualização de preços (padrão: 6 horas)
const PRICE_UPDATE_INTERVAL = parseInt(process.env.PRICE_UPDATE_INTERVAL) || 21600000;

app.listen(PORT, () => {
  const publicUrl = process.env.CLIENT_URL || (process.env.APP_DOMAIN ? `https://${process.env.APP_DOMAIN}` : null);
  if (publicUrl) {
    console.log(`API On! Servidor rodando publicamente em ${publicUrl} (porta interna: ${PORT})`);
  } else {
    console.log(`API On! Servidor rodando em http://localhost:${PORT}`);
  }
  
  // Inicia o serviço de atualização automática de preços
  priceUpdateService.start(PRICE_UPDATE_INTERVAL);
});
