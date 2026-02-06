import { create } from "zustand";
import { Channel, Track } from "./library";

interface Queue {
  channel: Channel;
  activeTrackId: string;
}

interface PlayerState {
  queue: Queue | undefined;
  isPlaying: boolean;
  isBuffering: boolean;
  progress: number;
}

export const usePlayerStore = create<PlayerState>(() => ({
  queue: undefined,
  isPlaying: false,
  isBuffering: false,
  progress: 0,
}));

// Selectors
export const selectIsPlaying = (state: PlayerState) => state.isPlaying;
export const selectIsBuffering = (state: PlayerState) => state.isBuffering;
export const selectProgress = (state: PlayerState) => state.progress;
export const selectQueue = (state: PlayerState) => state.queue;

export const selectQueueTracks = (state: PlayerState) =>
  state.queue?.channel.tracks;

export const selectActiveTrackIndex = (state: PlayerState) => {
  if (!state.queue) return -1;
  return state.queue.channel.tracks.findIndex(
    (track) => track.id === state.queue!.activeTrackId
  );
};

export const selectActiveTrack = (state: PlayerState) => {
  if (!state.queue) return undefined;
  return state.queue.channel.tracks[selectActiveTrackIndex(state)];
};

export const selectNextTrack = (state: PlayerState) => {
  const index = selectActiveTrackIndex(state);
  const tracks = selectQueueTracks(state);
  if (!tracks) return undefined;
  return tracks[index + 1] || tracks[0];
};

export const selectPreviousTrack = (state: PlayerState) => {
  const index = selectActiveTrackIndex(state);
  const tracks = selectQueueTracks(state);
  if (!tracks) return undefined;
  return tracks[index - 1] || tracks[0];
};

// Web Audio Player
let audioElement: HTMLAudioElement | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.addEventListener("ended", () => {
      playNext();
    });
    audioElement.addEventListener("waiting", () => {
      usePlayerStore.setState({ isBuffering: true });
    });
    audioElement.addEventListener("canplay", () => {
      usePlayerStore.setState({ isBuffering: false });
    });
    audioElement.addEventListener("error", () => {
      playNext(false);
    });
  }
  return audioElement;
}

function startProgressTracking() {
  stopProgressTracking();
  progressInterval = setInterval(() => {
    const audio = getAudio();
    if (!audio.paused && !isNaN(audio.currentTime)) {
      usePlayerStore.setState({ progress: audio.currentTime });
    }
  }, 500);
}

function stopProgressTracking() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

async function setTrack(track: Track) {
  const audio = getAudio();
  audio.src = track.url;
  audio.load();
}

export async function playChannel(channel: Channel, autoPlay = true) {
  const isPlaying = usePlayerStore.getState().isPlaying;
  const shouldPlay = autoPlay || isPlaying;

  usePlayerStore.setState({
    queue: {
      channel,
      activeTrackId: channel.tracks[0].id,
    },
    isPlaying: shouldPlay,
    isBuffering: false,
    progress: 0,
  });

  await setTrack(channel.tracks[0]);

  if (shouldPlay) {
    await play();
  }
}

export async function play() {
  usePlayerStore.setState({ isPlaying: true });
  try {
    await getAudio().play();
    startProgressTracking();
  } catch {
    // Autoplay might be blocked
  }
}

export async function pause() {
  usePlayerStore.setState({ isPlaying: false });
  getAudio().pause();
  stopProgressTracking();
}

export async function togglePlay() {
  if (usePlayerStore.getState().isPlaying) {
    return pause();
  }
  return play();
}

export function setActiveTrackId(activeTrackId: string) {
  usePlayerStore.setState((state) => ({
    progress: 0,
    queue: state.queue
      ? { ...state.queue, activeTrackId }
      : undefined,
  }));
}

export async function playNext(autoPlay = true) {
  const isPlaying = usePlayerStore.getState().isPlaying;
  const nextTrack = selectNextTrack(usePlayerStore.getState());

  if (nextTrack) {
    setActiveTrackId(nextTrack.id);
    await setTrack(nextTrack);

    if (isPlaying || autoPlay) {
      await play();
    }
  }
}

export async function playPrevious() {
  const index = selectActiveTrackIndex(usePlayerStore.getState());
  const progress = usePlayerStore.getState().progress;

  if (index === 0 || progress > 3) {
    const audio = getAudio();
    audio.currentTime = 0;
    usePlayerStore.setState({ progress: 0 });
    if (usePlayerStore.getState().isPlaying) {
      await play();
    }
    return;
  }

  const previousTrack = selectPreviousTrack(usePlayerStore.getState());

  if (previousTrack) {
    setActiveTrackId(previousTrack.id);
    await setTrack(previousTrack);
    await play();
  }
}

export function seekTo(positionInSeconds: number) {
  const audio = getAudio();
  audio.currentTime = positionInSeconds;
  usePlayerStore.setState({ progress: positionInSeconds });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
