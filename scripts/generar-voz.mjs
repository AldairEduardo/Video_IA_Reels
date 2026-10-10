// Genera voz con ElevenLabs + tiempos por carácter (para subtítulos).
// Uso: npm run voz -- --voz johanna --guion assets/guiones/reel-infieles.txt --salida assets/audio/reel-infieles/voz.mp3
//      npm run voz -- --voz johanna --texto "¡Hola, Aldair!" --salida assets/audio/prueba/voz.mp3
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parseArgs } from "node:util";
import { fromRoot, requireEnv } from "./lib/env.mjs";

const { values } = parseArgs({
  options: {
    voz: { type: "string", default: "johanna" },
    texto: { type: "string" },
    guion: { type: "string" },
    salida: { type: "string" },
  },
});
if ((!values.texto && !values.guion) || !values.salida) {
  console.error('Uso: --voz <alias|id> (--texto "..." | --guion archivo.txt) --salida ruta.mp3');
  process.exit(1);
}

const voces = JSON.parse(readFileSync(fromRoot("config/voces.json"), "utf8"));
const voiceId = voces[values.voz]?.id ?? values.voz;
const text = (values.texto ?? readFileSync(fromRoot(values.guion), "utf8")).replace(/\s+/g, " ").trim();
const key = requireEnv("ELEVENLABS_API_KEY");

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
  }),
});
if (!res.ok) {
  console.error("ElevenLabs", res.status, await res.text());
  process.exit(1);
}
const json = await res.json();
const out = fromRoot(values.salida);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(json.audio_base64, "base64"));
writeFileSync(out.replace(/\.mp3$/i, ".alignment.json"), JSON.stringify(json.alignment));
const dur = json.alignment.character_end_times_seconds.at(-1);
console.log(`✔ ${values.salida} (${dur.toFixed(2)} s, ${text.length} caracteres)`);
