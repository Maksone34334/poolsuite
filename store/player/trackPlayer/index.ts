import { Track } from "@/store/library/types";
import { TrackPlayerService } from "./types";
import { setProgress, setIsBuffering, playNext } from "../actions";

let audio: HTMLAudioElement | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

const clearProgressInterval = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

const startProgressTracking = () => {
  clearProgressInterval();
  progressInterval = setInterval(() => {
    if (audio && !audio.paused) {
      setProgress(audio.currentTime);
    }
  }, 500);
};

const createAudio = (track: Track) => {
  if (audio) {
    audio.pause();
    audio.src = "";
    clearProgressInterval();
  }

  audio = new Audio(track.url);
  audio.crossOrigin = "anonymous";

  audio.addEventListener("waiting", () => setIsBuffering(true));
  audio.addEventListener("canplay", () => setIsBuffering(false));
  audio.addEventListener("ended", () => {
    clearProgressInterval();
    playNext();
  });
  audio.addEventListener("error", () => {
    playNext(false);
  });
};

export const TrackPlayer: TrackPlayerService = {
  play: async () => {
    if (audio) {
      await audio.play();
      startProgressTracking();
    }
  },
  pause: async () => {
    if (audio) {
      audio.pause();
      clearProgressInterval();
    }
  },
  skipToNext: async (track: Track) => {
    createAudio(track);
  },
  skipToPrevious: async (track: Track) => {
    createAudio(track);
  },
  seekTo: async (positionInSeconds: number) => {
    if (audio) {
      audio.currentTime = positionInSeconds;
    }
  },
  reset: async () => {
    if (audio) {
      audio.pause();
      audio.src = "";
      clearProgressInterval();
      audio = null;
    }
  },
  setQueue: async (tracks: Track[]) => {
    if (tracks.length > 0) {
      createAudio(tracks[0]);
    }
  },
};
