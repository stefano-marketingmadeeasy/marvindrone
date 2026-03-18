import fs from "node:fs";
import path from "node:path";

const loadDotEnv = () => {
  const envPath = path.resolve(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  });
};

loadDotEnv();

const baseUrl = process.env.STRAPI_URL?.trim().replace(/\/$/, "");
const endpoint =
  process.env.STRAPI_PRODUCTIONS_ENDPOINT?.trim() || "produzioni";
const token = process.env.STRAPI_TOKEN?.trim();

if (!baseUrl) {
  console.error(
    "Manca STRAPI_URL. Configura il file .env prima di eseguire il check.",
  );
  process.exit(1);
}

const apiUrl = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
const url = new URL(`${apiUrl}/${endpoint}`);
url.searchParams.set("pagination[pageSize]", "5");
url.searchParams.set("populate", "*");

const response = await fetch(url, {
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});

if (!response.ok) {
  console.error(`Richiesta fallita: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const payload = await response.json();
const data = Array.isArray(payload?.data) ? payload.data : [];

console.log(`Endpoint: ${url.toString()}`);
console.log(`Produzioni ricevute: ${data.length}`);

data.forEach((item, index) => {
  const title =
    item?.attributes?.titolo ||
    item?.attributes?.title ||
    item?.titolo ||
    item?.title ||
    `item-${index + 1}`;
  const slug = item?.attributes?.slug || item?.slug || "";
  console.log(`- ${title}${slug ? ` (${slug})` : ""}`);
});
