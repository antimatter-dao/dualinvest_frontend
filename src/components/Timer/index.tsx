import { useEffect, useState } from 'react'

const formatTime = (d: number, h: number, m: number, s: number) => {
  if (d) {
    return `${d}d : ${h}h : ${m}m : ${s}s`
  } else {
    return `${h}h : ${m}m : ${s}s`
  }
}

export const getDeltaTime = (time: number, to = Date.now()) => {
  const correctedTime = time
  const delta = /*14*24*60*60*1000 -*/ (correctedTime - to) / 1000

  return delta > 0 ? delta : 0
}

export const toDeltaTimer = (delta: number) => {
  const d = Math.floor(delta / (60 * 60 * 24))
  const h = Math.floor((delta / (60 * 60)) % 24)
  const m = Math.floor((delta / 60) % 60)
  const s = Math.floor(delta % 60)
  return formatTime(d, h, m, s)
}

export const Timer = ({ timer, onZero }: { timer: number; onZero?: () => void }) => {
  const [time, setTime] = useState(getDeltaTime(timer))

  useEffect(() => {
    const tm = setInterval(() => setTime(getDeltaTime(timer)), 1000)
    return () => clearInterval(tm)
  }, [timer])

  useEffect(() => {
    if (!time) {
      onZero && onZero()
    }
  }, [time, onZero])

  return <>{toDeltaTimer(time)}</>
}
