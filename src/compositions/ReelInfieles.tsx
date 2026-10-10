import { Video } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Anton";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ReelCaptions } from "../components/ReelCaptions";

const { fontFamily: hookFont } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const ReelInfielesComposition = () => {
  return (
    <Composition
      id="ReelInfieles"
      component={ReelInfieles}
      durationInFrames={1010}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

export const ReelInfieles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Video
        name="Presentadora"
        src={staticFile("reel-infieles/avatar-hablando.mp4")}
        premountFor={fps}
        objectFit="cover"
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "50% 25%",
          // Punch-in zooms on: "ya lo sabe", "no vuelve", "sé hombre", "valorar"
          scale: interpolate(
            frame,
            [0, 300, 306, 540, 546, 560, 566, 640, 646, 680, 686, 800, 806, 855, 861, 1010],
            [1, 1, 1.15, 1.15, 1, 1, 1.2, 1.2, 1, 1, 1.15, 1.15, 1, 1, 1.22, 1.22],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 1, 0.68, 1),
            },
          ),
        }}
      />
      <Interactive.Div
        name="Barra de progreso"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 10,
          backgroundColor: "#FF3B5C",
          width: interpolate(frame, [0, durationInFrames], [0, 1080], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Titulo hook"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 170,
          textAlign: "center",
          fontFamily: hookFont,
          fontSize: 84,
          lineHeight: 1.05,
          color: "#FFFFFF",
          backgroundColor: "#FF3B5C",
          padding: "18px 28px",
          borderRadius: 18,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          rotate: "-2deg",

          scale: interpolate(frame, [0, 0.5 * fps, 455], [0, 1, 0.855], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",

            easing: [Easing.spring({
              damping: 10,
              mass: 1,
              stiffness: 100,
              overshootClamping: false
            }), Easing.linear],

            output: "perceptual-scale",
            outputType: "scale"
          }),

          translate: "0px -121.2px"
        }}
      >
        MENSAJE PARA LOS INFIELES 👀
      </Interactive.Div>
      <ReelCaptions
        name="Subtitulos"
        premountFor={fps}
        durationInFrames={897}
        width={900}
        style={{
          position: "absolute",
          top: 1180,
          translate: "90px 0px",
        }}
        captions={[
            {text: "¿Eres", startMs: 0, endMs: 302, timestampMs: 151, confidence: null},
            {text: " infiel?", startMs: 418, endMs: 1033, timestampMs: 725, confidence: null, pageBreakAfter: true},
            {text: " Quédate,", startMs: 1463, endMs: 2206, timestampMs: 1835, confidence: null, pageBreakAfter: true},
            {text: " que", startMs: 2415, endMs: 2554, timestampMs: 2484, confidence: null},
            {text: " esto", startMs: 2577, endMs: 2752, timestampMs: 2665, confidence: null},
            {text: " es", startMs: 2786, endMs: 2833, timestampMs: 2810, confidence: null},
            {text: " para", startMs: 2891, endMs: 3077, timestampMs: 2984, confidence: null},
            {text: " ti.", startMs: 3146, endMs: 3529, timestampMs: 3338, confidence: null, pageBreakAfter: true},
            {text: " Borras", startMs: 4029, endMs: 4470, timestampMs: 4249, confidence: null},
            {text: " los", startMs: 4516, endMs: 4656, timestampMs: 4586, confidence: null},
            {text: " chats,", startMs: 4714, endMs: 5294, timestampMs: 5004, confidence: null, pageBreakAfter: true},
            {text: " cambias", startMs: 5457, endMs: 5840, timestampMs: 5649, confidence: null},
            {text: " la", startMs: 5898, endMs: 5956, timestampMs: 5927, confidence: null},
            {text: " contraseña,", startMs: 6014, endMs: 6920, timestampMs: 6467, confidence: null, pageBreakAfter: true},
            {text: " pones", startMs: 7152, endMs: 7512, timestampMs: 7332, confidence: null},
            {text: " el", startMs: 7593, endMs: 7651, timestampMs: 7622, confidence: null},
            {text: " celular", startMs: 7686, endMs: 8115, timestampMs: 7901, confidence: null},
            {text: " boca", startMs: 8185, endMs: 8429, timestampMs: 8307, confidence: null},
            {text: " abajo...", startMs: 8452, endMs: 9102, timestampMs: 8777, confidence: null, pageBreakAfter: true},
            {text: " Pero", startMs: 9532, endMs: 9834, timestampMs: 9683, confidence: null},
            {text: " ella", startMs: 9915, endMs: 10136, timestampMs: 10026, confidence: null},
            {text: " ya", startMs: 10194, endMs: 10275, timestampMs: 10235, confidence: null},
            {text: " lo", startMs: 10333, endMs: 10437, timestampMs: 10385, confidence: null},
            {text: " sabe.", startMs: 10495, endMs: 11029, timestampMs: 10762, confidence: null, pageBreakAfter: true},
            {text: " Nosotras", startMs: 11447, endMs: 11947, timestampMs: 11697, confidence: null},
            {text: " siempre", startMs: 11981, endMs: 12341, timestampMs: 12161, confidence: null},
            {text: " lo", startMs: 12365, endMs: 12457, timestampMs: 12411, confidence: null},
            {text: " sabemos.", startMs: 12492, endMs: 13224, timestampMs: 12858, confidence: null, pageBreakAfter: true},
            {text: " Y", startMs: 13653, endMs: 13735, timestampMs: 13694, confidence: null},
            {text: " el", startMs: 13816, endMs: 13874, timestampMs: 13845, confidence: null},
            {text: " día", startMs: 13944, endMs: 14153, timestampMs: 14049, confidence: null},
            {text: " que", startMs: 14211, endMs: 14303, timestampMs: 14257, confidence: null},
            {text: " se", startMs: 14350, endMs: 14454, timestampMs: 14402, confidence: null},
            {text: " canse,", startMs: 14512, endMs: 15105, timestampMs: 14809, confidence: null, pageBreakAfter: true},
            {text: " no", startMs: 15430, endMs: 15592, timestampMs: 15511, confidence: null},
            {text: " va", startMs: 15650, endMs: 15720, timestampMs: 15685, confidence: null},
            {text: " a", startMs: 15743, endMs: 15766, timestampMs: 15755, confidence: null},
            {text: " gritar", startMs: 15813, endMs: 16173, timestampMs: 15993, confidence: null},
            {text: " ni", startMs: 16231, endMs: 16289, timestampMs: 16260, confidence: null},
            {text: " a", startMs: 16324, endMs: 16358, timestampMs: 16341, confidence: null},
            {text: " llorar.", startMs: 16382, endMs: 16974, timestampMs: 16678, confidence: null, pageBreakAfter: true},
            {text: " Se", startMs: 17345, endMs: 17485, timestampMs: 17415, confidence: null},
            {text: " va", startMs: 17543, endMs: 17636, timestampMs: 17590, confidence: null},
            {text: " a", startMs: 17659, endMs: 17682, timestampMs: 17670, confidence: null},
            {text: " ir.", startMs: 17752, endMs: 18112, timestampMs: 17932, confidence: null, pageBreakAfter: true},
            {text: " Y", startMs: 18425, endMs: 18495, timestampMs: 18460, confidence: null},
            {text: " no", startMs: 18611, endMs: 18693, timestampMs: 18652, confidence: null},
            {text: " vuelve.", startMs: 18739, endMs: 19273, timestampMs: 19006, confidence: null, pageBreakAfter: true},
            {text: " Mi", startMs: 19772, endMs: 19912, timestampMs: 19842, confidence: null},
            {text: " consejo:", startMs: 19970, endMs: 20701, timestampMs: 20336, confidence: null, pageBreakAfter: true},
            {text: " si", startMs: 21073, endMs: 21270, timestampMs: 21172, confidence: null},
            {text: " ya", startMs: 21328, endMs: 21432, timestampMs: 21380, confidence: null},
            {text: " no", startMs: 21479, endMs: 21560, timestampMs: 21520, confidence: null},
            {text: " la", startMs: 21618, endMs: 21688, timestampMs: 21653, confidence: null},
            {text: " quieres,", startMs: 21746, endMs: 22292, timestampMs: 22019, confidence: null, pageBreakAfter: true},
            {text: " sé", startMs: 22501, endMs: 22710, timestampMs: 22606, confidence: null},
            {text: " hombre", startMs: 22768, endMs: 23162, timestampMs: 22965, confidence: null},
            {text: " y", startMs: 23232, endMs: 23290, timestampMs: 23261, confidence: null},
            {text: " díselo.", startMs: 23383, endMs: 23987, timestampMs: 23685, confidence: null, pageBreakAfter: true},
            {text: " Porque", startMs: 24799, endMs: 25124, timestampMs: 24962, confidence: null},
            {text: " la", startMs: 25171, endMs: 25241, timestampMs: 25206, confidence: null},
            {text: " mujer", startMs: 25287, endMs: 25600, timestampMs: 25444, confidence: null},
            {text: " que", startMs: 25682, endMs: 25809, timestampMs: 25746, confidence: null},
            {text: " hoy", startMs: 25844, endMs: 26030, timestampMs: 25937, confidence: null},
            {text: " engañas...", startMs: 26076, endMs: 26878, timestampMs: 26477, confidence: null, pageBreakAfter: true},
            {text: " mañana", startMs: 27388, endMs: 27795, timestampMs: 27592, confidence: null},
            {text: " otro", startMs: 27888, endMs: 28131, timestampMs: 28010, confidence: null},
            {text: " la", startMs: 28189, endMs: 28271, timestampMs: 28230, confidence: null},
            {text: " va", startMs: 28329, endMs: 28456, timestampMs: 28393, confidence: null},
            {text: " a", startMs: 28549, endMs: 28584, timestampMs: 28566, confidence: null},
            {text: " valorar.", startMs: 28642, endMs: 29339, timestampMs: 28990, confidence: null, pageBreakAfter: true},
            {text: " Etiqueta", startMs: 29943, endMs: 30546, timestampMs: 30245, confidence: null},
            {text: " a", startMs: 30570, endMs: 30593, timestampMs: 30582, confidence: null},
            {text: " ese", startMs: 30628, endMs: 30767, timestampMs: 30697, confidence: null},
            {text: " amigo", startMs: 30790, endMs: 31115, timestampMs: 30953, confidence: null},
            {text: " que", startMs: 31150, endMs: 31220, timestampMs: 31185, confidence: null},
            {text: " necesita", startMs: 31266, endMs: 31800, timestampMs: 31533, confidence: null},
            {text: " escuchar", startMs: 31823, endMs: 32241, timestampMs: 32032, confidence: null},
            {text: " esto.", startMs: 32311, endMs: 33159, timestampMs: 32735, confidence: null, pageBreakAfter: true},
        ]}
      />
      <Interactive.Div
        name="CTA etiqueta"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1160,
          textAlign: "center",
          fontFamily: hookFont,
          fontSize: 96,
          lineHeight: 1.1,
          color: "#000000",
          backgroundColor: "#FFE14D",
          padding: "26px 30px",
          borderRadius: 24,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
          opacity: interpolate(frame, [896, 897], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [897, 912], [0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 9 }),
            output: "perceptual-scale",
          }),
          translate: interpolate(frame, [930, 945, 960, 975, 990], ["0px 0px", "0px 18px", "0px 0px", "0px 18px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        ETIQUETA A ESE AMIGO 👇
      </Interactive.Div>
    </AbsoluteFill>
  );
};
