import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { Song } from '@/providers/SongsProvider'

export function AudioPlayer({ song }: { song: Song }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const analyzerRef = useRef<AudioMotionAnalyzer | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)


  useEffect(() => {
    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.destroy()
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    togglePlay()
  }, [])

  useEffect(() => {
    togglePlay()
  }, [song])

  useEffect(() => {
    if (containerRef.current && audioRef.current && !analyzerRef.current) {
      const initializeAudio = () => {
        audioRef.current.volume = 1;
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

        if (sourceNodeRef.current) {
          console.log("Disconnecting source node")
          sourceNodeRef.current.disconnect()
        }
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)

        analyzerRef.current = new AudioMotionAnalyzer(containerRef.current, {
          source: sourceNodeRef.current,
          colorMode: 'bar-level',
          overlay: true,
          gradient: 'prism',
          mode: 2,
          barSpace: .5,
          ledBars: true,
          minDecibels: -120,
          maxDecibels: -20,
          maxFreq: 16000,
          minFreq: 30,
          bgAlpha: 0,
          showBgColor: false,
          showPeaks: false,
          showScaleX: false,
          weightingFilter: 'D'
        })

        console.log(analyzerRef.current)


        sourceNodeRef.current.connect(audioContextRef.current.destination)
      }

      initializeAudio()
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => {
          setError("Failed to play audio. Please check your audio source.")
          console.error(e)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextTrack = () => {
    // Implement next track logic here
    console.log("Next track")
  }

  const previousTrack = () => {
    // Implement previous track logic here
    console.log("Previous track")
  }

  return (
    <div className="w-full">
      <div className="" ref={containerRef}>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <audio
        ref={audioRef}
        src={song.url}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          setError("Failed to load audio. Please check your audio source.")
          console.error("Audio error:", e)
        }}
      />
    </div>
  )
}
