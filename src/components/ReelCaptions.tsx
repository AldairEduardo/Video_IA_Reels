import type { Caption } from "@remotion/captions";
import { createTikTokStyleCaptions } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import React, { useMemo } from "react";
import {
  Interactive,
  useCurrentFrame,
  useVideoConfig,
  type InteractiveTransformProps,
  type InteractivitySchema,
  type SequenceProps,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["900"],
  subsets: ["latin"],
});

// Words that get the highlight color, to punch the key ideas
const KEYWORDS =
  /^(infiel|sabe|siempre|sabemos|gritar|llorar|vuelve|consejo|hombre|díselo|engañas|valorar|etiqueta)$/i;

type ReelCaptionsProps = InteractiveTransformProps &
  Pick<SequenceProps, "width"> & {
    readonly captions: Caption[];
    readonly combineTokensWithinMilliseconds?: number;
    readonly activeColor?: string;
    readonly highlightColor?: string;
  };

const reelCaptionsSchema = {
  ...Interactive.captionsSchema,
  width: {
    type: "number",
    min: 1,
    step: 1,
    default: undefined,
    description: "Caption area width",
    hiddenFromList: false,
  },
  combineTokensWithinMilliseconds: {
    type: "number",
    min: 0,
    step: 50,
    default: 900,
    description: "Time between caption pages",
    hiddenFromList: false,
  },
  activeColor: {
    type: "color",
    default: "#FFE14D",
    description: "Spoken word color",
  },
  highlightColor: {
    type: "color",
    default: "#FF3B5C",
    description: "Keyword color",
  },
} as const satisfies InteractivitySchema;

const ReelCaptionsContent: React.FC<ReelCaptionsProps> = ({
  captions,
  combineTokensWithinMilliseconds = 900,
  activeColor = "#FFE14D",
  highlightColor = "#FF3B5C",
  style,
  width = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(
    () =>
      createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds })
        .pages,
    [captions, combineTokensWithinMilliseconds],
  );
  const currentTimeMs = (frame / fps) * 1000;
  const page = pages.find(
    (candidate) =>
      currentTimeMs >= candidate.startMs &&
      currentTimeMs < candidate.startMs + candidate.durationMs,
  );

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        width,
        ...style,
      }}
    >
      {page ? (
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 1.15,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "0.45em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            WebkitTextStroke: "14px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
          }}
        >
          {page.tokens.map((token) => {
            const isActive =
              currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
            const isKeyword = KEYWORDS.test(
              token.text.trim().replace(/[¿?¡!.,:…]/g, ""),
            );
            return (
              <span
                key={token.fromMs}
                style={{
                  display: "inline-block",
                  color: isKeyword
                    ? highlightColor
                    : isActive
                      ? activeColor
                      : "#FFFFFF",
                  scale: isActive ? "1.08" : "1",
                }}
              >
                {token.text.trim()}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export const ReelCaptions = Interactive.withSchema({
  Component: ReelCaptionsContent,
  componentName: "<ReelCaptions>",
  schema: reelCaptionsSchema,
  wrapInSequence: true,
});
