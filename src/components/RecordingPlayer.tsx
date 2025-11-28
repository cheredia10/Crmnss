import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2, X } from 'lucide-react';

interface RecordingPlayerProps {
  recordingUrl: string;
  onClose: () => void;
}

export function RecordingPlayer({ recordingUrl, onClose }: RecordingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar que la URL es válida
    if (!recordingUrl) {
      setError('URL de grabación no disponible');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [recordingUrl]);

  const handlePlayPause = () => {
    const audio = document.getElementById('recording-audio') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteUnmute = () => {
    const audio = document.getElementById('recording-audio') as HTMLAudioElement;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-[8px] p-[24px] max-w-[400px] w-full mx-[16px]">
          <div className="flex items-center justify-between mb-[16px]">
            <h3 className="font-['Open_Sans:SemiBold',sans-serif] text-[18px] text-[#333333]">
              Error
            </h3>
            <button onClick={onClose} className="hover:bg-[#f9f9f9] p-[4px] rounded-[4px] transition-colors">
              <X className="size-[20px]" color="#333333" />
            </button>
          </div>
          <p className="font-['Open_Sans:Regular',sans-serif] text-[14px] text-[#999999]">
            {error}
          </p>
          <button
            onClick={onClose}
            className="mt-[16px] bg-[#004179] text-white px-[20px] py-[10px] rounded-[8px] font-['Open_Sans:SemiBold',sans-serif] text-[14px] hover:bg-[#003060] transition-colors w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[8px] p-[24px] max-w-[500px] w-full mx-[16px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h3 className="font-['Open_Sans:SemiBold',sans-serif] text-[18px] text-[#333333]">
            Reproducir Grabación
          </h3>
          <button onClick={onClose} className="hover:bg-[#f9f9f9] p-[4px] rounded-[4px] transition-colors">
            <X className="size-[20px]" color="#333333" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader2 className="size-[40px] animate-spin" color="#004179" />
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <audio
              id="recording-audio"
              src={recordingUrl}
              onEnded={() => setIsPlaying(false)}
              className="w-full"
              controls
            />

            <div className="flex items-center justify-center gap-[16px]">
              <button
                onClick={handlePlayPause}
                className="bg-[#004179] text-white size-[48px] rounded-full flex items-center justify-center hover:bg-[#003060] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="size-[24px]" />
                ) : (
                  <Play className="size-[24px] ml-[2px]" />
                )}
              </button>

              <button
                onClick={handleMuteUnmute}
                className="bg-[#e6f0fe] text-[#004179] size-[40px] rounded-full flex items-center justify-center hover:bg-[#d0e4fc] transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="size-[20px]" />
                ) : (
                  <Volume2 className="size-[20px]" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
