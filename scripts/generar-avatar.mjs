// Genera a la persona de la imagen hablando con el audio (lip-sync) usando HeyGen Avatar IV vía OpenRouter.
// OpenRouter exige el audio en una URL HTTPS pública: el script lo sube a litterbox.catbox.moe (se borra solo en 1 h).
// Costo aproximado: 0,05 USD por segundo de video.
// Uso: npm run avatar -- --imagen assets/imagenes/presentadora-9x16.jpg --audio assets/audio/reel-infieles/voz.mp3 --salida public/reel-infieles/avatar-hook.mp4 --hasta 9
// --hasta <segundos>: genera solo el hook. Corta el audio en el final de frase más cercano (sin pasarse),
//                     usando el .alignment.json que está junto al audio. Ahorra ~75 % frente al video completo.
// --simular: solo recorta el audio y muestra duración/costo, sin subir nada ni gastar.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { parseArgs } from "node:util";
import { fromRoot, requireEnv } from "./lib/env.mjs";
import { ffmpeg } from "./lib/ffmpeg.mjs";

const { values } = parseArgs({
  options: {
    imagen: { type: "string" },
    audio: { type: "string" },
    salida: { type: "string" },
    formato: { type: "string", default: "9:16" },
    resolucion: { type: "string", default: "1080p" },
    hasta: { type: "string" },
    simular: { type: "boolean", default: false },
    prompt: {
      type: "string",
      default:
        "A confident host speaks directly to camera, giving frank advice. Natural expressive face, subtle head movements, expressive eyebrows, occasional gentle hand gestures on strong lines.",
    },
  },
});
if (!values.imagen || !values.audio || !values.salida) {
  console.error("Uso: --imagen foto.jpg --audio voz.mp3 --salida video.mp4 [--formato 9:16|16:9|1:1]");
  process.exit(1);
}

const key = requireEnv("OPENROUTER_API_KEY");
const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const imagePath = fromRoot(values.imagen);
const mime = /\.png$/i.test(imagePath) ? "image/png" : "image/jpeg";

let audioFile = values.audio.startsWith("https://") ? null : fromRoot(values.audio);

// Modo hook: recorta el audio al final de frase más cercano a --hasta
if (values.hasta && audioFile) {
  const limitMs = Number(values.hasta) * 1000;
  const alignmentPath = audioFile.replace(/\.mp3$/i, ".alignment.json");
  let cutMs = limitMs;
  if (existsSync(alignmentPath)) {
    const a = JSON.parse(readFileSync(alignmentPath, "utf8"));
    const ends = [];
    a.characters.forEach((c, i) => {
      const next = a.characters[i + 1];
      if (/[.?!…:]/.test(c) && (next === undefined || /\s/.test(next))) {
        const nextStart = a.character_start_times_seconds[i + 2] ?? a.character_end_times_seconds[i];
        // Corta a mitad del silencio entre frases
        ends.push(Math.round(((a.character_end_times_seconds[i] + nextStart) / 2) * 1000));
      }
    });
    const candidates = ends.filter((ms) => ms <= limitMs);
    cutMs = candidates.length ? candidates.at(-1) : ends[0] ?? limitMs;
  }
  const hookFile = audioFile.replace(/\.mp3$/i, "-hook.mp3");
  ffmpeg(["-i", audioFile, "-t", (cutMs / 1000).toFixed(3), hookFile]);
  console.log(
    `Hook: ${(cutMs / 1000).toFixed(2)} s → en la composición usa durationInFrames={${Math.round((cutMs / 1000) * 30)}} (a 30 fps) para el tramo del avatar.`,
  );
  console.log(`Costo estimado: ${((cutMs / 1000) * 0.05).toFixed(2)} USD`);
  audioFile = hookFile;
}

if (values.simular) {
  console.log("Simulación: no se subió nada ni se llamó a OpenRouter.");
  process.exit(0);
}

let audioUrl = values.audio;
if (audioFile) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("time", "1h");
  form.append("fileToUpload", new Blob([readFileSync(audioFile)]), basename(audioFile));
  const up = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", { method: "POST", body: form });
  audioUrl = (await up.text()).trim();
  if (!audioUrl.startsWith("https://")) throw new Error(`Falló la subida del audio: ${audioUrl}`);
  console.log("Audio subido temporalmente (1 h):", audioUrl);
}

const submit = await fetch("https://openrouter.ai/api/v1/videos", {
  method: "POST",
  headers,
  body: JSON.stringify({
    model: "heygen/avatar-iv",
    prompt: values.prompt,
    aspect_ratio: values.formato,
    resolution: values.resolucion,
    input_references: [
      { type: "image_url", image_url: { url: `data:${mime};base64,${readFileSync(imagePath).toString("base64")}` } },
      { type: "audio_url", audio_url: { url: audioUrl } },
    ],
  }),
});
const job = await submit.json();
if (!job.polling_url) {
  console.error("OpenRouter", submit.status, JSON.stringify(job));
  process.exit(1);
}
console.log("Trabajo enviado:", job.id);

for (;;) {
  await new Promise((r) => setTimeout(r, 15000));
  const s = await (await fetch(job.polling_url, { headers })).json();
  console.log(new Date().toLocaleTimeString(), s.status);
  if (s.status === "completed") {
    const v = await fetch(s.unsigned_urls[0], { headers });
    const out = fromRoot(values.salida);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, Buffer.from(await v.arrayBuffer()));
    console.log(`✔ ${values.salida} (costo: ${s.usage?.cost} USD)`);
    break;
  }
  if (["failed", "cancelled", "expired"].includes(s.status)) {
    console.error("Error:", JSON.stringify(s.error ?? s));
    process.exit(1);
  }
}
