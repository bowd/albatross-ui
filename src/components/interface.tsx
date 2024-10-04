import React, { useState, useEffect, useContext } from 'react'
import { FileAudio2 } from 'lucide-react'
import { AudioPlayer } from './audio-player'
import { ref, onValue } from 'firebase/database'
import { AuthContext } from '@/providers/FirebaseAuthProvider'
import { db } from "@/lib/firebase"
import { ChatBubbleComponent } from './chat-bubble'
import { useListVals, useObjectVal } from 'react-firebase-hooks/database'
import ParticleAnimation from './particle'


export function Interface() {
  const { signOut, user } = useContext(AuthContext)
  // const [messages, setMessages] = useState<Array<{ text: string; timestamp: number, uid: string }>>([])
  // const [queue, setQueue] = useState<Array<{ name: string; url: string }>>([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [messages] = useListVals(ref(db, `users/${user.uid}/messages`))
  const [queue] = useListVals(ref(db, `users/${user.uid}/queue`))
  const [symbol] = useObjectVal(ref(db, `users/${user.uid}/symbol`))

  return (
    <div className="tw-flex tw-flex-col tw-h-screen tw-bg-gray-100 tw-text-gray-800 tw-font-sans tw-text-lg">
      <div className="tw-flex tw-flex-1 tw-overflow-hidden tw-p-2 tw-space-x-2">
        <div className="tw-w-1/2 tw-flex tw-flex-col tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
          <div className="tw-flex-1 tw-p-4 tw-overflow-y-auto tw-space-y-4">
            {messages.map((message) => (
              <ChatBubbleComponent key={message.timestamp} text={message.text} />
            ))}
          </div>
          <div className="tw-flex tw-items-center tw-justify-center tw-m-4 tw-relative tw-top-8">
            <ParticleAnimation {...symbol} />
          </div>
        </div>

        <div className="tw-w-1/2 tw-flex tw-flex-col tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
          <div className="tw-flex-1 tw-p-4 tw-overflow-y-auto tw-space-y-2">
            {queue.map((song) => (
              <div
                key={song.url}
                className={`tw-p-2 tw-cursor-pointer tw-hover:tw-bg-gray-100 tw-rounded ${selectedFile === song.name ? 'tw-bg-blue-100' : ''
                  }`}
                onClick={() => setSelectedFile(song.name)}
              >
                <div className="tw-flex tw-items-center">
                  <FileAudio2 className="tw-mr-2 tw-text-blue-500" size={20} />
                  <span className="tw-mr-4">{song.name}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedFile && (
            <div className="tw-flex tw-items-center tw-justify-center tw-m-4">
              <AudioPlayer song={queue.find((song) => song.name === selectedFile)} />
            </div>
          )}
        </div>
      </div>

      <div className="tw-bg-gray-200 tw-text-gray-700 tw-p-2 tw-text-sm"
        onClick={signOut}>
        Ready
      </div>
    </div >
  )
}
