// Recorta una imagen horizontal a vertical 9:16 (1080x1920) usando el ffmpeg incluido en Remotion.
// Uso: npm run recortar -- --entrada assets/imagenes/foto.png --salida assets/imagenes/foto-9x16.jpg [--centro-x 0.5]
// --centro-x: posición horizontal del sujeto (0 = izquierda, 1 = derecha).
import { parseArgs } from "node:util";
import { fromRoot } from "./lib/env.mjs";
import { ffmpeg } from "./lib/ffmpeg.mjs";

const { values } = parseArgs({
  options: {
    entrada: { type: "string" },
    salida: { type: "string" },
    "centro-x": { type: "string", default: "0.5" },
  },
});
if (!values.entrada || !values.salida) {
  console.error("Uso: --entrada foto.png --salida foto-9x16.jpg [--centro-x 0.5]");
  process.exit(1);
}
const cx = Number(values["centro-x"]);
const filter = `crop=ih*9/16:ih:max(0\\,min(iw-ih*9/16\\,iw*${cx}-ih*9/32)):0,scale=1080:1920:flags=lanczos`;
ffmpeg(["-i", fromRoot(values.entrada), "-vf", filter, "-q:v", "2", fromRoot(values.salida)]);
console.log(`✔ ${values.salida}`);
