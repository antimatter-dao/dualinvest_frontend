import { useEffect, useRef } from 'react'
import Lottie from 'lottie-web'
import { Box, SxProps } from '@mui/material'

export default function AnimatedSvg({
  fileName,
  sx,
  className,
  onClick
}: {
  fileName: string
  sx?: SxProps
  className?: string
  onClick?: () => void
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    Lottie.loadAnimation({
      container: ref.current, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/animations/${fileName}.json`
    })
  }, [fileName])

  return (
    <Box
      ref={ref}
      className={className}
      style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'flex-end' }}
      sx={sx}
      onClick={onClick}
    ></Box>
  )
}
