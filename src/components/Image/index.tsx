import React from 'react'

interface Props {
  src: string
  alt?: string
  style?: React.CSSProperties
}

export default function Image(props: Props) {
  const { src, alt = '', style, ...rest } = props

  return <img {...rest} src={src} alt={alt} style={style} />
}
