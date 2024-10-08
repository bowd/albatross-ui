import { useState, useEffect, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ChatBubbleProps {
  text: string
  className?: string
}

const useTypingEffect = (text: string, delay: number, startTyping: boolean) => {
  const [displayText, setDisplayText] = useState('')

  const revealOneCharacter = useCallback(() => {
    setDisplayText((currentText) => {
      if (currentText.length < text.length) {
        return text.slice(0, currentText.length + 1)
      }
      return currentText
    })
  }, [text])

  useEffect(() => {
    if (!startTyping) return

    const intervalId = setInterval(revealOneCharacter, delay)

    return () => clearInterval(intervalId)
  }, [delay, revealOneCharacter, startTyping])

  return displayText
}

export function ChatBubbleComponent({ text, className, style }: ChatBubbleProps) {
  const [isInitialTyping, setIsInitialTyping] = useState(true)
  const displayText = useTypingEffect(text, 100, !isInitialTyping)

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsInitialTyping(false)
    }, 2000)

    return () => clearTimeout(typingTimeout)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "dark:bg-slate-700 dark:text-white rounded-lg bg-gray-100 transition-all duration-300 min-h-14 leading-normal mb-4",
          isInitialTyping ? "w-20" : "w-full max-w-md",
          className
        )}
        style={style}
      >
        <div className={cn(
          "h-full flex items-center transition-all duration-300 ease-in-out",
          isInitialTyping ? "justify-center p-6" : "justify-start p-5"
        )}>
          {isInitialTyping ? (
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-slate-700 dark:bg-white animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-slate-700 dark:bg-white animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-slate-700 dark:bg-white animate-bounce delay-200" />
            </div>
          ) : (
            <p className="break-words whitespace-pre-wrap overflow-hidden">{displayText}</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

interface ChatProps {
  messages: { text: string; timestamp: number }[]
}

export const ChatSection = ({ messages }: ChatProps) => {
  return (
    <div>
      {messages.map((message) => (
        <ChatBubbleComponent key={message.timestamp} text={message.text} />
      ))}
    </div>
  )
}
