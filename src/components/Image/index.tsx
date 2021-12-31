import { Theme, styled } from '@mui/material'
import { SxProps } from '@mui/system'
import { ImgHTMLAttributes, useMemo, useState } from 'react'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

const StyledImg = styled('img')({})

export default function Image({
  src,
  alt = '',
  style,
  className,
  altSrc,
  ...rest
}: {
  src: string
  alt?: string
  style?: React.CSSProperties | SxProps<Theme>
  className?: string
  altSrc?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'style'>) {
  const [, refresh] = useState<number>(0)
  const srcs = useMemo(() => [src, altSrc], [src, altSrc])
  const srcStr = srcs.find(item => !BAD_SRCS[item ?? ''])
  return (
    <StyledImg
      {...rest}
      src={srcStr}
      alt={alt}
      sx={style}
      className={className}
      onError={() => {
        if (srcStr) BAD_SRCS[srcStr] = true
        refresh(i => i + 1)
      }}
    />
  )
}
