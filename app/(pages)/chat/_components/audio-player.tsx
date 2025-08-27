"use client";

import { Progress } from "@/app/components/ui/progress";
import { LucidePause, LucidePlay } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface WhatsAppAudioPlayerProps {
  apiUrl: string;
}

export default function WhatsAppAudioPlayer({
  apiUrl,
}: WhatsAppAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6);
  const [loading, setLoading] = useState(true);

  // Ondas animadas estilo WhatsApp
  const waveCount = 20;
  const waves = Array.from({ length: waveCount });

  // Baixa áudio como Blob
  const fetchAudio = async () => {
    setLoading(true);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(6);

    const res = await fetch(apiUrl);
    const blob = await res.blob();
    const localUrl = URL.createObjectURL(blob);
    setAudioUrl(localUrl);
    setLoading(false);
  };

  useEffect(() => {
    const fetchAudio = async () => {
      setLoading(true);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      const res = await fetch(apiUrl);
      const blob = await res.blob();
      const localUrl = URL.createObjectURL(blob);
      setAudioUrl(localUrl);
      setLoading(false);

      // Força o carregamento para que loadedmetadata seja chamado
      if (audioRef.current) {
        audioRef.current.src = localUrl;
        audioRef.current.load();
      }
    };

    fetchAudio();

    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [apiUrl]);

  // Play / Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100
    );
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    //setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  // Seek clicando na barra
  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / audioRef.current.duration) * 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (loading) return <div>Carregando áudio...</div>;

  return (
    <div className="flex items-center gap-2 w-full p-2 dark:bg-slate-700 bg-gray-100 rounded-lg">
      {/* Botão Play / Pause */}
      <button onClick={handlePlayPause} className="flex-shrink-0">
        {isPlaying ? <LucidePause size={20} /> : <LucidePlay size={20} />}
      </button>

      {/* Barra de progresso com ondas */}
      <div className="flex-1 flex flex-col">
        <div
          className="relative w-full h-6 flex items-center cursor-pointer"
          onClick={handleSeek}
        >
          {/* Ondas */}
          <div className="flex gap-[2px] absolute left-0 top-0 bottom-0 items-end w-full">
            {waves.map((_, i) => (
              <div
                key={i}
                className={`bg-blue-500 rounded-sm`}
                style={{
                  width: 2,
                  height: Math.random() * 6 + 4,
                  transition: "height 0.2s",
                }}
              />
            ))}
          </div>
          {/* Barra de progresso Shadcn */}
          <Progress
            value={progress}
            className="absolute top-0 left-0 h-2 rounded-lg bg-blue-200 dark:bg-orange-300"
          />
        </div>

        {/* Tempo */}
        <div className="text-xs dark:text-muted-foreground text-gray-600 flex justify-between mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}
