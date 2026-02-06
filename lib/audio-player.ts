import type { Track } from "@/lib/types"

class WebAudioPlayer {
  private audio: HTMLAudioElement | null = null
  private progressInterval: ReturnType<typeof setInterval> | null = null
  private onProgressCallback: ((seconds: number) => void) | null = null
  private onEndedCallback: (() => void) | null = null
  private onBufferingCallback: ((buffering: boolean) => void) | null = null

  init() {
    if (this.audio) return
    this.audio = new Audio()
    this.audio.crossOrigin = "anonymous"

    this.audio.addEventListener("ended", () => {
      this.onEndedCallback?.()
    })

    this.audio.addEventListener("waiting", () => {
      this.onBufferingCallback?.(true)
    })

    this.audio.addEventListener("canplay", () => {
      this.onBufferingCallback?.(false)
    })

    this.audio.addEventListener("playing", () => {
      this.onBufferingCallback?.(false)
    })
  }

  onProgress(cb: (seconds: number) => void) {
    this.onProgressCallback = cb
  }

  onEnded(cb: () => void) {
    this.onEndedCallback = cb
  }

  onBuffering(cb: (buffering: boolean) => void) {
    this.onBufferingCallback = cb
  }

  private startProgressTracking() {
    this.stopProgressTracking()
    this.progressInterval = setInterval(() => {
      if (this.audio && !this.audio.paused) {
        this.onProgressCallback?.(this.audio.currentTime)
      }
    }, 500)
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval)
      this.progressInterval = null
    }
  }

  async setTrack(track: Track) {
    this.init()
    if (!this.audio) return
    const wasPlaying = !this.audio.paused
    this.audio.pause()
    this.stopProgressTracking()
    this.audio.src = track.url
    this.audio.load()
    if (wasPlaying) {
      await this.play()
    }
  }

  async play() {
    this.init()
    if (!this.audio) return
    try {
      await this.audio.play()
      this.startProgressTracking()
    } catch (e) {
      // Autoplay may be blocked
      console.warn("Playback failed:", e)
    }
  }

  async pause() {
    if (!this.audio) return
    this.audio.pause()
    this.stopProgressTracking()
  }

  async seekTo(positionInSeconds: number) {
    if (!this.audio) return
    this.audio.currentTime = positionInSeconds
  }

  get isPlaying() {
    return this.audio ? !this.audio.paused : false
  }
}

export const audioPlayer = new WebAudioPlayer()
