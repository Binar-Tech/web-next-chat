"use client";

import { Mic, Pause, Play, Send, Square, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Recording = {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  createdAt: number;
};

type Props = {
  maxDurationSec?: number;
  onSend?: (file: File, duration: number) => Promise<void> | void;
};

export default function AudioRecorderPopup({
  maxDurationSec = 60,
  onSend,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [recording, setRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [levels, setLevels] = useState<number[]>(new Array(16).fill(0));
  const [waitingPauseChunk, setWaitingPauseChunk] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pausedDurationRef = useRef<number>(0);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        if (!startTimeRef.current) return;
        const elapsed = Math.floor(
          (Date.now() - startTimeRef.current + pausedDurationRef.current) / 1000
        );
        setCurrentDuration(elapsed);
        if (elapsed >= maxDurationSec) stopRecording();
      }, 250);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, isPaused]);

  // === inicializa gravador + captador de volume
  const initRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = recorder;

    // cria contexto de audio para medir o volume
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 32;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevels = () => {
      analyser.getByteFrequencyData(dataArray);
      const normalized = Array.from(dataArray).map((n) => Math.min(1, n / 128));
      setLevels(normalized);
      rafRef.current = requestAnimationFrame(updateLevels);
    };

    updateLevels();

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);

      // Se está aguardando chunk do pause, atualize o player
      if (waitingPauseChunk) {
        setWaitingPauseChunk(false);
        if (chunksRef.current.length > 0) {
          if (recording?.url) {
            URL.revokeObjectURL(recording.url);
          }
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          setRecording({
            id: String(Date.now()),
            blob,
            url,
            duration: currentDuration,
            createdAt: Date.now(),
          });
        }
      }
    };

    recorder.onstop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];
      const url = URL.createObjectURL(blob);
      const createdAt = Date.now();

      setRecording({
        id: String(createdAt),
        blob,
        url,
        duration: currentDuration,
        createdAt,
      });
      setCurrentDuration(0);
    };
  };

  const startRecording = async () => {
    // Sempre inicializa um novo MediaRecorder e stream
    await initRecorder();
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    chunksRef.current = [];
    recorder.start();
    setIsRecording(true);
    setShowPopup(true);
    setIsPaused(false);
    setIsStopped(false);
    startTimeRef.current = Date.now();
    setCurrentDuration(0);
    setRecording(null);
    pausedDurationRef.current = 0;
    setLevels(new Array(16).fill(0));
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    const recorder = mediaRecorderRef.current;

    if (recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
      setIsRecording(false);

      if (startTimeRef.current) {
        pausedDurationRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    }
  };

  // Ao clicar em "stop", apenas pausa e mostra o player
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    const recorder = mediaRecorderRef.current;

    if (recorder.state !== "inactive") {
      // 🔴 força a emissão dos últimos dados antes de parar
      recorder.requestData();
      recorder.stop();
    }

    setIsRecording(false);
    setIsPaused(false);
    setIsStopped(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 🔊 montar blob final dentro do onstop
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      if (blob.size === 0) return;

      const url = URL.createObjectURL(blob);
      setRecording({
        id: String(Date.now()),
        blob,
        url,
        duration: currentDuration,
        createdAt: Date.now(),
      });

      chunksRef.current = [];
    };
  };

  // Ao clicar em "Mic" para continuar gravando
  const resumeRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.resume();
    setIsPaused(false);
    setIsRecording(true);
    setIsStopped(false);
    startTimeRef.current = Date.now();
  };

  // Finaliza de verdade (stop do MediaRecorder)
  const finalizeRecording = () => {
    if (!mediaRecorderRef.current) return;
    try {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.warn("Erro ao parar gravador", e);
    }
    setIsRecording(false);
    setIsPaused(false);
    setIsStopped(false);
    startTimeRef.current = null;
    pausedDurationRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Libera microfone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSend = async () => {
    if (!recording || !onSend) return;

    const file = new File([recording.blob], `audio-${recording.id}.webm`, {
      type: recording.blob.type,
    });

    await onSend(file, recording.duration);

    // só limpar depois que terminar mesmo
    setTimeout(() => {
      setRecording(null);
      setShowPopup(false);
    }, 0);
  };

  const handleCancel = () => {
    finalizeRecording(); // garante que tudo seja parado

    if (recording) {
      URL.revokeObjectURL(recording.url);
    }

    setRecording(null);
    setIsRecording(false);
    setIsPaused(false);
    setIsStopped(false);
    setCurrentDuration(0);
    setShowPopup(false);

    chunksRef.current = [];

    // Limpa referências do MediaRecorder e stream
    mediaRecorderRef.current = null;
    streamRef.current = null;
  };

  const togglePlay = () => {
    if (!recording || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.onplay = () => setIsPlaying(true);
    audioRef.current.onpause = () => setIsPlaying(false);
    audioRef.current.onended = () => setIsPlaying(false);
  }, [recording]);

  const formatTime = (sec: number) => {
    const s = sec % 60;
    const m = Math.floor(sec / 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div>
      {/* botão inicial de gravar */}
      {!isRecording && !showPopup && (
        <button
          onClick={startRecording}
          className="p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white"
        >
          <Mic size={20} />
        </button>
      )}

      {/* popup estilo WhatsApp */}
      {showPopup && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-gray-900 text-white p-3 rounded-xl shadow-lg flex items-center gap-3">
          {/* Lixeira */}
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <Trash2 size={20} />
          </button>

          {/* Tempo + visualizador */}
          <div className="flex items-center gap-2 flex-1">
            <span
              className={`text-sm ${
                isRecording ? "text-red-400" : "text-gray-300"
              }`}
            >
              {formatTime(currentDuration)}
            </span>

            {/* barrinhas que sobem/descem */}
            {isRecording && !isStopped && (
              <div className="flex gap-[2px] items-end flex-1 h-6">
                {levels.slice(0, 16).map((l, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-400 rounded"
                    style={{ height: `${Math.max(2, l * 24)}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Controles durante gravação */}
          {isRecording && !isStopped && (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="p-2 hover:bg-gray-800 rounded-full"
                >
                  <Pause size={20} />
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="p-2 hover:bg-gray-800 rounded-full"
                >
                  <Play size={20} />
                </button>
              )}
              <button
                onClick={stopRecording}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <Square size={20} />
              </button>
            </>
          )}

          {/* Preview depois de stop, com opção de continuar gravando */}
          {recording && isStopped && (
            <>
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <audio ref={audioRef} src={recording?.url} controls />
              <button
                type="button"
                onClick={handleSend}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700"
              >
                <Send size={20} />
              </button>
            </>
          )}

          {/* Preview depois de finalizar */}
          {recording && !isStopped && !isRecording && (
            <>
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <audio ref={audioRef} src={recording?.url} controls />
              <button
                type="button"
                onClick={handleSend}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700"
              >
                <Send size={20} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
