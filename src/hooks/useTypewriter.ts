'use client'

import { useState, useEffect, useRef } from 'react'

export interface UseTypewriterOptions {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
}

export function useTypewriter({ text, speed = 50, delay = 0, onComplete }: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    let index = 0
    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(interval)
          setDone(true)
          onComplete?.()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, delay, onComplete])

  return { displayed, done }
}
