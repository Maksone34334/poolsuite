import { Track } from "@/store/library/types";
import { TrackPlayerService } from "./types";
import { usePlayerStore } from "../store";

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
      usePlayerStore.setState({ progress: audio.currentTime });
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

  audio.addEventListener("waiting", () => {
    usePlayerStore.setState({ isBuffering: true });
  });
  audio.addEventListener("canplay", () => {
    usePlayerStore.setState({ isBuffering: false });
  });
  audio.addEventListener("ended", () => {
    clearProgressInterval();
    // Lazy import to avoid circular dependency
    import("../actions").then(({ playNext }) => playNext());
  });
  audio.addEventListener("error", () => {
    import("../actions").then(({ playNext }) => playNext(false));
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
