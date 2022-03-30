import { styled } from '@mui/material'
import React from 'react'
import Image from '../Image'

const Wrapper = styled('div')({})

export default function LogoText({
  logo,
  text,
  fontWeight,
  fontSize,
  gapSize,
  size,
  style
}: {
  logo: string | JSX.Element
  text?: string | React.ReactNode
  fontWeight?: number
  fontSize?: number
  gapSize?: 'small' | 'large'
  size?: string
  style?: React.CSSProperties
}) {
  return (
    <Wrapper
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: fontWeight ?? 400,
        fontSize: fontSize ?? 16,
        '& > img, > svg': {
          marginRight: gapSize === 'small' ? '4px' : '12px',
          height: size ? size : '20px',
          width: size ? size : '20px'
        },
        ...style
      }}
    >
      {typeof logo === 'string' ? <Image src={logo as string} alt={`${text} logo`} /> : logo}
      <span>{text}</span>
    </Wrapper>
  )
}
