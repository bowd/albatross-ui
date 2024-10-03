import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import AudioMotionAnalyzer from 'audiomotion-analyzer'
import { Song } from '@/providers/SongsProvider'

export function AudioPlayer({ song }: Song) {
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
    if (containerRef.current && audioRef.current && !analyzerRef.current) {
      const initializeAudio = () => {
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect()
        }
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current!)

        analyzerRef.current = new AudioMotionAnalyzer(containerRef.current, {
          source: sourceNodeRef.current,
          mode: 2,
          barSpace: .1,
          gradient: 'prism',
          lumiBars: true,
          minDecibels: -80,
          maxDecibels: -30,
          maxFreq: 16000,
          minFreq: 30,
          bgAlpha: 0,
          showBgColor: true,
          showPeaks: false,
          showScaleX: false,
          weightingFilter: 'D'
        })

        console.log(analyzerRef.current)


        sourceNodeRef.current.connect(audioContextRef.current.destination)
      }

      initializeAudio()

      return () => {
        if (analyzerRef.current) {
          analyzerRef.current.destroy()
          analyzerRef.current = null
        }
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect()
          sourceNodeRef.current = null
        }
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }
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
    <div className="tw-w-full tw-bg-gray-900 tw-text-white tw-p-4 tw-rounded-lg tw-shadow-lg">
      <div className="tw-mb-4 tw-h-24 tw-bg-white tw-overflow-hidden" ref={containerRef}>
      </div>
      <div className="tw-text-center tw-mb-4 tw-truncate">{song.name}</div>
      <div className="tw-flex tw-justify-center tw-space-x-4">
        <button onClick={previousTrack} className="tw-p-2 hover:tw-bg-gray-700 tw-rounded">
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlay} className="tw-p-2 hover:tw-bg-gray-700 tw-rounded">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={nextTrack} className="tw-p-2 hover:tw-bg-gray-700 tw-rounded">
          <SkipForward size={24} />
        </button>
      </div>
      {error && <div className="tw-text-red-500 tw-text-sm tw-mt-2">{error}</div>}
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
