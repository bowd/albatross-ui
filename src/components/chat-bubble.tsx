import React, { useState, useEffect, useCallback } from 'react'
import { cn } from "@/lib/utils"

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

export function ChatBubbleComponent({ text, className }: ChatBubbleProps) {
  const [isInitialTyping, setIsInitialTyping] = useState(true)
  const displayText = useTypingEffect(text, 100, !isInitialTyping)

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsInitialTyping(false)
    }, 2000)

    return () => clearTimeout(typingTimeout)
  }, [])

  return (
    <div
      className={cn(
        "tw-rounded-lg tw-bg-gray-100 tw-transition-all tw-duration-300 tw-ease-in-out tw-min-h-14 tw-leading-normal",
        isInitialTyping ? "tw-w-20" : "tw-w-full tw-max-w-md",
        className
      )}
    >
      <div className={cn(
        "tw-h-full tw-flex tw-items-center tw-transition-all tw-duration-300 tw-ease-in-out",
        isInitialTyping ? "tw-justify-center tw-p-6" : "tw-justify-start tw-p-5"
      )}>
        {isInitialTyping ? (
          <div className="tw-flex tw-space-x-2">
            <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-slate-600 tw-animate-bounce" />
            <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-slate-600 tw-animate-bounce tw-delay-100" />
            <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-slate-600 tw-animate-bounce tw-delay-200" />
          </div>
        ) : (
          <p className="tw-break-words tw-whitespace-pre-wrap tw-overflow-hidden">{displayText}</p>
        )}
      </div>
    </div>
  )
}
