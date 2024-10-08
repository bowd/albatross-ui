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
    setIsPlaying(false)
  }, [song])

  useEffect(() => {
    if (containerRef.current && audioRef.current && !analyzerRef.current) {
      const initializeAudio = () => {
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
    <div className="w-full bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <div className="mb-4 h-24 bg-white rounded-lg overflow-hidden" ref={containerRef}>
      </div>
      <div className="text-center mb-4 truncate">{song.name}</div>
      <div className="flex justify-center space-x-4">
        <button onClick={previousTrack} className="p-2 hover:bg-gray-700 rounded">
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlay} className="p-2 hover:bg-gray-700 rounded">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={nextTrack} className="p-2 hover:bg-gray-700 rounded">
          <SkipForward size={24} />
        </button>
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
