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

interface LibraryState {
  channels: Channel[];
  isLoading: boolean;
  error: string | null;
  setChannels: (channels: Channel[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  channels: [],
  isLoading: true,
  error: null,
  setChannels: (channels) => set({ channels, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));

export async function fetchChannels(): Promise<Channel[]> {
  const response = await fetch(
    "https://api.poolsidefm.workers.dev/v1/get_tracks_by_playlist"
  );
  const data = await response.json();

  return data.payload.map((channel: any) => ({
    id: channel.slug,
    url: channel.url,
    name: channel.name.toLowerCase().includes("poolsuite fm")
      ? "Poolsuite FM"
      : channel.name,
    slug: channel.slug,
    order: channel.order,
    totalTracks: channel.total_tracks,
    tracks: channel.tracks_in_order.map((track: any) => ({
      id: track.soundcloud_id,
      url: `https://api.poolsidefm.workers.dev/v2/get_sc_mp3_stream?track_id=${track.soundcloud_id}`,
      title: track.title,
      artist: track.artist,
      durationMs: track.duration_ms,
      dateAdded: track.date_added,
      waveformUrl: track.waveform_url.replace(".png", ".json"),
      soundcloudUrl: track.permalink_url,
    })),
  }));
}

export async function initLibrary() {
  const store = useLibraryStore.getState();
  store.setLoading(true);
  try {
    const channels = await fetchChannels();
    store.setChannels(channels);
    return channels;
  } catch (e) {
    store.setError("Failed to load channels");
    return [];
  }
}
