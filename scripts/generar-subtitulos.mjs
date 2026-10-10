// Convierte los tiempos por carácter de ElevenLabs en subtítulos palabra por palabra (formato Caption de Remotion).
// Marca pageBreakAfter al final de cada frase para que no se mezclen oraciones en una misma línea.
// Uso: npm run subtitulos -- --alineacion assets/audio/reel-infieles/voz.alignment.json --salida assets/subtitulos/reel-infieles.json
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parseArgs } from "node:util";
import { fromRoot } from "./lib/env.mjs";

const { values } = parseArgs({
  options: { alineacion: { type: "string" }, salida: { type: "string" } },
});
if (!values.alineacion || !values.salida) {
  console.error("Uso: --alineacion archivo.alignment.json --salida subtitulos.json");
  process.exit(1);
}

const a = JSON.parse(readFileSync(fromRoot(values.alineacion), "utf8"));
const words = [];
let cur = null;
a.characters.forEach((c, i) => {
  if (/\s/.test(c)) {
    if (cur) words.push(cur);
    cur = null;
    return;
  }
  cur ??= { text: "", s: a.character_start_times_seconds[i], e: 0 };
  cur.text += c;
  cur.e = a.character_end_times_seconds[i];
});
if (cur) words.push(cur);

const captions = words.map((w, i) => ({
  text: (i ? " " : "") + w.text,
  startMs: Math.round(w.s * 1000),
  endMs: Math.round(w.e * 1000),
  timestampMs: Math.round(((w.s + w.e) / 2) * 1000),
  confidence: null,
  ...(/[.?:,!…]$/.test(w.text) ? { pageBreakAfter: true } : {}),
}));

const out = fromRoot(values.salida);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(captions, null, 2));
console.log(`✔ ${values.salida}: ${captions.length} palabras, termina en ${captions.at(-1).endMs} ms`);
console.log("  Pega este array en la prop `captions` de <ReelCaptions> para que siga editable en Studio.");
