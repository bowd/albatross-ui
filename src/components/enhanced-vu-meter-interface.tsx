import React, { useState, useEffect, useContext } from 'react'
import { Play, Pause, SkipBack, SkipForward, FileAudio2, MessageSquare, Headphones } from 'lucide-react'
import { AudioPlayer } from './audio-player'
import { SongsContext } from '@/providers/SongsProvider'
import { AuthContext } from '@/providers/FirebaseAuthProvider'

export function EnhancedVuMeterInterface() {
  const { signOut } = useContext(AuthContext)
  const { songs } = useContext(SongsContext)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, I am the AI agent. How can I assist you today?" },
    { id: 2, text: "I have access to a wide range of information and audio files." },
    { id: 3, text: "Please let me know if you have any questions or if you'd like to play an audio file." },
  ])

  const [selectedFile, setSelectedFile] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [vuLevels, setVuLevels] = useState(Array(20).fill(0))

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="tw-flex tw-flex-col tw-h-screen tw-bg-gray-100 tw-text-gray-800 tw-font-sans tw-text-lg">
      <div className="tw-flex tw-flex-1 tw-overflow-hidden tw-p-2 tw-space-x-2">
        <div className="tw-w-1/2 tw-flex tw-flex-col tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
          <div className="tw-flex-1 tw-p-4 tw-overflow-y-auto tw-space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="tw-bg-gray-100 tw-p-3 tw-rounded-lg">
                {message.text}
              </div>
            ))}
          </div>
        </div>

        <div className="tw-w-1/2 tw-flex tw-flex-col tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
          <div className="tw-flex-1 tw-p-4 tw-overflow-y-auto tw-space-y-2">
            {songs.map((song) => (
              <div
                key={song.name}
                className={`p-2 cursor-pointer hover:bg-gray-100 rounded ${selectedFile === song.name ? 'bg-blue-100' : ''
                  }`}
                onClick={() => setSelectedFile(song.name)}
              >
                <div className="tw-flex tw-items-center">
                  <FileAudio2 className="tw-mr-2 tw-text-blue-500" size={20} />
                  <span className="tw-mr-4">{song.name}</span>
                  <span className="tw-text-gray-500 tw-ml-auto">TO:DO</span>
                </div>
              </div>
            ))}
          </div>

          {selectedFile && (
            <div className="tw-flex tw-items-center tw-justify-center tw-m-8">
              <AudioPlayer song={songs.find((song) => song.name === selectedFile)} />
            </div>
          )}
        </div>
      </div>

      <div className="tw-bg-gray-200 tw-text-gray-700 tw-p-2 tw-text-sm"
        onClick={signOut}>
        Ready
      </div>
    </div>
  )
}
