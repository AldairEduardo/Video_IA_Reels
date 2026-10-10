import { Folder } from "remotion";
import { ReelInfielesComposition } from "./compositions/ReelInfieles";
import { ReelInfielesHookComposition } from "./compositions/ReelInfielesHook";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Reels">
        <ReelInfielesComposition />
        <ReelInfielesHookComposition />
      </Folder>
    </>
  );
};
