import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Carga .env de la raíz del proyecto sin dependencias externas
export function loadEnv() {
  const file = resolve(ROOT, ".env");
  if (!existsSync(file)) {
    throw new Error(`No existe ${file}. Copia .env.example a .env y completa tus claves.`);
  }
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

export function requireEnv(name) {
  loadEnv();
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en .env`);
  return value;
}

export const fromRoot = (...p) => resolve(ROOT, ...p);
