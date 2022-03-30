import { useEffect, useRef } from 'react'
import Lottie from 'lottie-web'

export default function AnimatedSvg({ fileName }: { fileName: string }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    Lottie.loadAnimation({
      container: ref.current, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/animations/${fileName}.json` // the path to the animation json
    })
  }, [fileName])

  return <div ref={ref} style={{ height: '100%', width: '100%' }}></div>
}
