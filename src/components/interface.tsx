import React, { useState, useEffect, useContext } from 'react'
import { FileAudio2, Play, Pause, MessageCircle, AudioLines } from 'lucide-react'
import { AudioPlayer } from './minimal-player'
import { ref, set, remove } from 'firebase/database'
import { AuthContext } from '@/providers/FirebaseAuthProvider'
import { db } from "@/lib/firebase"
import { ChatSection } from './chat-bubble'
import { useListVals, useObjectVal } from 'react-firebase-hooks/database'
import ParticleAnimation from './particle'
import { Song } from '@/providers/SongsProvider'

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="w-1/2 flex flex-col card-bg rounded-lg dark:border-2 dark:border-slate-700 shadow-md overflow-hidden">
    {children}
  </div>
)

const Header = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-400 dark:bg-slate-700 text-white p-2 flex justify-center items-center">
    {children}
  </div>
)

const Content = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 p-4 overflow-y-auto space-y-4">
    {children}
  </div>
)


export function Interface() {
  const { signOut, user } = useContext(AuthContext)
  const [messages] = useListVals(ref(db, `users/${user.uid}/messages`))
  const [queue] = useListVals<Song>(ref(db, `users/${user.uid}/queue`))
  const [symbol] = useObjectVal(ref(db, `users/${user.uid}/symbol`))
  const [playing] = useObjectVal<Song>(ref(db, `users/${user.uid}/playing`))

  const togglePlay = (song: Song) => {
    const playingRef = ref(db, `users/${user.uid}/playing`)
    if (playing && playing.name === song.name) {
      remove(playingRef)
    } else {
      set(playingRef, { name: song.name, url: song.url })
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-black font-sans text-lg">
      <div className="flex flex-1 overflow-hidden p-2 space-x-2">
        <Section>
          <Header>
            <MessageCircle size={24} />
          </Header>
          <Content>
            <ChatSection messages={messages} />
          </Content>
          <div className="flex items-center justify-center absolute bottom-0 left-10">
            <ParticleAnimation {...symbol} height={350} width={400} />
          </div>
        </Section>

        <Section>
          <Header>
            <AudioLines size={24} />
          </Header>
          <Content>
            {queue.map((song) => (
              <div
                key={song.url}
                className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded ${playing && playing.name === song.name ? 'bg-blue-100 dark:bg-slate-700' : ''
                  }`}
                onClick={() => togglePlay(song)}
              >
                <div className="flex items-center pointer group">
                  {playing && playing.name === song.name ? (
                    <Pause className="mr-2 text-red-500" size={20} />
                  ) : (
                    <>
                      <FileAudio2 className="mr-2 text-blue-500 dark:text-white group-hover:hidden" size={20} />
                      <Play className="mr-2 text-blue-500 dark:text-white hidden group-hover:flex" size={20} />
                    </>
                  )}
                  <span className="mr-4 dark:text-white">{song.name}</span>
                </div>
              </div>
            ))}
          </Content>

          {playing && playing.url && (
            <div className="flex items-center justify-center m-4">
              <AudioPlayer song={playing} />
            </div>
          )}
        </Section>
      </div>

      <div className="bg-gray-200 dark:bg-black text-gray-700 dark:text-white p-2 text-sm"
        onClick={signOut}>
        Ready
      </div>
    </div >
  )
}
