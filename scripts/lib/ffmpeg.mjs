import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fromRoot, ROOT } from "./env.mjs";

// Usa el ffmpeg que trae Remotion. Se llama directo (sin shell) para que las rutas con espacios funcionen.
const bundled = {
  win32: "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe",
  darwin: `node_modules/@remotion/compositor-darwin-${process.arch}/ffmpeg`,
  linux: `node_modules/@remotion/compositor-linux-${process.arch}-gnu/ffmpeg`,
}[process.platform];

export function ffmpeg(args) {
  const bin = bundled && existsSync(fromRoot(bundled)) ? fromRoot(bundled) : "ffmpeg";
  execFileSync(bin, ["-y", "-loglevel", "error", ...args], { cwd: ROOT, stdio: "inherit" });
}
