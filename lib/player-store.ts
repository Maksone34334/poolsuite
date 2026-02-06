import { create } from "zustand";

export interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  durationMs: number;
  dateAdded: string;
  waveformUrl: string;
  soundcloudUrl: string;
}

export interface Channel {
  id: string;
  url: string;
  name: string;
  slug: string;
  totalTracks: number;
  tracks: Track[];
  order: number;
}

interface PlayerState {
  channels: Channel[];
  currentChannel: Channel | null;
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  audioElement: HTMLAudioElement | null;
  setChannels: (channels: Channel[]) => void;
  playChannel: (channel: Channel) => void;
  playTrack: (track: Track, index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setProgress: (progress: number) => void;
  seekTo: (seconds: number) => void;
  nextChannel: () => void;
  previousChannel: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  channels: [],
  currentChannel: null,
  currentTrack: null,
  currentTrackIndex: 0,
  isPlaying: false,
  isLoading: false,
  progress: 0,
  duration: 0,
  audioElement: null,

  setChannels: (channels) => set({ channels }),

  playChannel: (channel) => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.pause();
    }
    const audio = new Audio(channel.tracks[0].url);
    audio.crossOrigin = "anonymous";
    
    audio.addEventListener("timeupdate", () => {
      set({ progress: audio.currentTime });
    });
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration, isLoading: false });
    });
    audio.addEventListener("ended", () => {
      get().playNext();
    });
    audio.addEventListener("waiting", () => set({ isLoading: true }));
    audio.addEventListener("canplay", () => set({ isLoading: false }));

    set({
      currentChannel: channel,
      currentTrack: channel.tracks[0],
      currentTrackIndex: 0,
      audioElement: audio,
      isPlaying: true,
      progress: 0,
      isLoading: true,
    });
    audio.play().catch(() => set({ isPlaying: false }));
  },

  playTrack: (track, index) => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.pause();
    }
    const audio = new Audio(track.url);
    audio.crossOrigin = "anonymous";

    audio.addEventListener("timeupdate", () => {
      set({ progress: audio.currentTime });
    });
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration, isLoading: false });
    });
    audio.addEventListener("ended", () => {
      get().playNext();
    });
    audio.addEventListener("waiting", () => set({ isLoading: true }));
    audio.addEventListener("canplay", () => set({ isLoading: false }));

    set({
      currentTrack: track,
      currentTrackIndex: index,
      audioElement: audio,
      isPlaying: true,
      progress: 0,
      isLoading: true,
    });
    audio.play().catch(() => set({ isPlaying: false }));
  },

  togglePlay: () => {
    const state = get();
    if (!state.audioElement) return;
    if (state.isPlaying) {
      state.audioElement.pause();
      set({ isPlaying: false });
    } else {
      state.audioElement.play().catch(() => {});
      set({ isPlaying: true });
    }
  },

  playNext: () => {
    const state = get();
    if (!state.currentChannel) return;
    const nextIndex = (state.currentTrackIndex + 1) % state.currentChannel.tracks.length;
    const nextTrack = state.currentChannel.tracks[nextIndex];
    get().playTrack(nextTrack, nextIndex);
  },

  playPrevious: () => {
    const state = get();
    if (!state.currentChannel) return;
    if (state.progress > 3) {
      state.audioElement?.currentTime && (state.audioElement.currentTime = 0);
      set({ progress: 0 });
      return;
    }
    const prevIndex =
      state.currentTrackIndex === 0
        ? state.currentChannel.tracks.length - 1
        : state.currentTrackIndex - 1;
    const prevTrack = state.currentChannel.tracks[prevIndex];
    get().playTrack(prevTrack, prevIndex);
  },

  setProgress: (progress) => set({ progress }),

  seekTo: (seconds) => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.currentTime = seconds;
      set({ progress: seconds });
    }
  },

  nextChannel: () => {
    const state = get();
    if (!state.currentChannel || state.channels.length === 0) return;
    const idx = state.channels.findIndex((c) => c.id === state.currentChannel?.id);
    const nextIdx = (idx + 1) % state.channels.length;
    get().playChannel(state.channels[nextIdx]);
  },

  previousChannel: () => {
    const state = get();
    if (!state.currentChannel || state.channels.length === 0) return;
    const idx = state.channels.findIndex((c) => c.id === state.currentChannel?.id);
    const prevIdx = idx === 0 ? state.channels.length - 1 : idx - 1;
    get().playChannel(state.channels[prevIdx]);
  },
}));
