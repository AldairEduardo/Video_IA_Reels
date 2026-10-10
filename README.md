# Formato Video IA

Reels verticales hechos con IA: una foto + un guion → la persona habla con tu texto, con subtítulos animados estilo TikTok.

**Flujo:** guion → **ElevenLabs** (voz + tiempos por palabra) → **HeyGen Avatar IV vía OpenRouter** (lip-sync) → **Remotion** (subtítulos, zooms, hook, CTA) → MP4.

## Estructura

```
Formato Video IA/
├── .env                  # Claves privadas (NO se sube a Git)
├── .env.example          # Plantilla de claves
├── config/
│   └── voces.json        # Alias de voces de ElevenLabs (johanna, elena, ...)
├── assets/               # Material fuente (no lo usa Remotion directamente)
│   ├── guiones/          # Textos de cada reel (.txt)
│   ├── imagenes/         # Fotos originales y recortes 9:16
│   ├── audio/
│   │   ├── muestras-voces/   # Pruebas de voces
│   │   └── <reel>/           # voz.mp3 + voz.alignment.json de cada reel
│   └── subtitulos/       # Subtítulos generados (.json)
├── public/               # Archivos que usa Remotion (staticFile)
│   └── <reel>/avatar-hablando.mp4
├── scripts/              # Automatización del flujo
│   ├── lib/env.mjs           # Carga de .env
│   ├── generar-voz.mjs       # ElevenLabs
│   ├── generar-subtitulos.mjs
│   ├── generar-avatar.mjs    # HeyGen Avatar IV (OpenRouter)
│   └── recortar-9x16.mjs     # Recorte vertical de la foto
├── src/                  # Proyecto Remotion
│   ├── Root.tsx              # Registro de composiciones
│   ├── compositions/         # Un archivo por reel (ReelInfieles.tsx)
│   └── components/           # Piezas reutilizables (ReelCaptions.tsx)
└── out/                  # Videos renderizados (NO se sube a Git)
```

## Configuración inicial

```console
npm i
copy .env.example .env     # y completa ELEVENLABS_API_KEY y OPENROUTER_API_KEY
```

## Crear un reel nuevo (ejemplo: `mi-reel`)

1. **Guion** → escribe `assets/guiones/mi-reel.txt` (ideal: 25–30 s, hook en la primera frase).
2. **Foto vertical** (si la original es horizontal):
   ```console
   npm run recortar -- --entrada assets/imagenes/foto.png --salida assets/imagenes/foto-9x16.jpg --centro-x 0.5
   ```
3. **Voz**:
   ```console
   npm run voz -- --voz johanna --guion assets/guiones/mi-reel.txt --salida assets/audio/mi-reel/voz.mp3
   ```
4. **Subtítulos**:
   ```console
   npm run subtitulos -- --alineacion assets/audio/mi-reel/voz.alignment.json --salida assets/subtitulos/mi-reel.json
   ```
5. **Avatar con lip-sync SOLO en el hook** (recomendado, ≈ 0,45 USD por reel):
   ```console
   # Primero simula para ver dónde corta y cuánto cuesta (gratis):
   npm run avatar -- --imagen assets/imagenes/foto-9x16.jpg --audio assets/audio/mi-reel/voz.mp3 --salida public/mi-reel/avatar-hook.mp4 --hasta 9 --simular
   # Luego genera de verdad (quita --simular):
   npm run avatar -- --imagen assets/imagenes/foto-9x16.jpg --audio assets/audio/mi-reel/voz.mp3 --salida public/mi-reel/avatar-hook.mp4 --hasta 9
   ```
   El script corta el audio en el final de frase más cercano a `--hasta` y te dice el `durationInFrames` del tramo del avatar.
   Sin `--hasta` genera el video completo con lip-sync (≈ 0,05 USD/s → 1,50 USD por 30 s).
   > OpenRouter exige el audio en una URL pública: el script lo sube a litterbox.catbox.moe y se borra solo en 1 hora.
6. **Composición** → duplica `src/compositions/ReelInfielesHook.tsx` (avatar en el hook + foto animada) y ajusta:
   - `id`, rutas en `staticFile(...)` (copia `voz.mp3` y la foto 9:16 a `public/mi-reel/`)
   - `durationInFrames` del tramo **Hook avatar** (el valor que dio el script)
   - los tramos **Foto: …**: un `Series.Sequence` por frase, con su encuadre (scale/transformOrigin)
   - los subtítulos en `captions={[...]}` y la duración total en `<Composition>`
   - regístrala en `src/Root.tsx`
7. **Previsualizar y editar** → `npm run dev` (Remotion Studio).
8. **Renderizar**:
   ```console
   npx remotion render MiReel out/mi-reel.mp4
   ```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Abre Remotion Studio |
| `npm run render:reel-infieles` | Reel de ejemplo con lip-sync completo |
| `npm run render:reel-infieles-hook` | Reel de ejemplo con lip-sync solo en el hook (formato recomendado) |
| `npm run voz -- ...` | Genera voz con ElevenLabs |
| `npm run subtitulos -- ...` | Convierte tiempos de voz en subtítulos |
| `npm run avatar -- ...` | Genera el video con lip-sync |
| `npm run recortar -- ...` | Recorta una foto a 9:16 |
| `npm run lint` | Revisa el código (ESLint + TypeScript) |

## Notas para Reels

- Duración objetivo: **~30 s** (guion de unas 75–80 palabras con la voz de Johanna).
- En los primeros planos de la foto usa `transformOrigin` alto (`50% 0%`–`50% 10%`) para que la cara quede debajo del título.

- La franja inferior (~350 px) y el lateral derecho los tapa la interfaz de Instagram/TikTok: deja ahí solo elementos no críticos.
- Palabras clave resaltadas en rojo: se configuran en `KEYWORDS` dentro de `src/components/ReelCaptions.tsx`.
