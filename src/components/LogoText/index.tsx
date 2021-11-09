import { styled } from '@mui/material'
import Image from '../Image'

const Wrapper = styled('div')({})

export default function LogoText({
  logo,
  text,
  fontWeight,
  fontSize,
  gapSize,
  size
}: {
  logo: string | JSX.Element
  text?: string | React.ReactNode
  fontWeight?: number
  fontSize?: number
  gapSize?: 'small' | 'large'
  size?: string
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
        }
      }}
    >
      {typeof logo === 'string' ? <Image src={logo as string} alt={`${text} logo`} /> : logo}
      <span>{text}</span>
    </Wrapper>
  )
}
