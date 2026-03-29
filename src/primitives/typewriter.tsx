'use client'

import { useState, useEffect, useRef } from 'react'
import { Cursor } from './cursor'
import type { CursorStyle } from './cursor'

export interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  cursor?: CursorStyle | false
  onComplete?: () => void
  className?: string
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  cursor = 'block',
  onComplete,
  className,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const hasRun = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

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
          onCompleteRef.current?.()
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, delay])

  return (
    <span className={className}>
      {displayed}
      {!done && cursor !== false && <Cursor style={cursor} />}
    </span>
  )
}
