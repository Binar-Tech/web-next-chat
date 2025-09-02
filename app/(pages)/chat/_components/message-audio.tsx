import AudioPlayer from "./audio-player";

interface Props {
  src: string;
}

export default function MessageAudio({ src }: Props) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <AudioPlayer apiUrl={src} />
    </div>
  );
}
