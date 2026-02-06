import { create } from "zustand"
import type { Channel } from "@/lib/types"

interface LibraryState {
  channels: Channel[]
  loading: boolean
  error: string | null
}

interface LibraryActions {
  fetchChannels: () => Promise<Channel[]>
}

export const useLibraryStore = create<LibraryState & LibraryActions>()((set) => ({
  channels: [],
  loading: false,
  error: null,

  fetchChannels: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch("https://api.poolsidefm.workers.dev/v1/get_tracks_by_playlist")
      const data = await res.json()

      const channels: Channel[] = data.payload.map((channel: Record<string, unknown>) => ({
        id: (channel as Record<string, unknown>).slug as string,
        url: (channel as Record<string, unknown>).url as string,
        name: ((channel as Record<string, unknown>).name as string).toLowerCase().includes("poolsuite fm")
          ? "Poolsuite FM"
          : (channel as Record<string, unknown>).name as string,
        slug: (channel as Record<string, unknown>).slug as string,
        order: (channel as Record<string, unknown>).order as number,
        totalTracks: (channel as Record<string, unknown>).total_tracks as number,
        tracks: ((channel as Record<string, unknown>).tracks_in_order as Record<string, unknown>[]).map(
          (track: Record<string, unknown>) => ({
            id: track.soundcloud_id as string,
            url: `https://api.poolsidefm.workers.dev/v2/get_sc_mp3_stream?track_id=${track.soundcloud_id}`,
            title: track.title as string,
            artist: track.artist as string,
            durationMs: track.duration_ms as number,
            dateAdded: track.date_added as string,
            waveformUrl: (track.waveform_url as string).replace(".png", ".json"),
            soundcloudUrl: track.permalink_url as string,
          })
        ),
      }))

      set({ channels, loading: false })
      return channels
    } catch (e) {
      set({ error: "Failed to load channels", loading: false })
      return []
    }
  },
}))
