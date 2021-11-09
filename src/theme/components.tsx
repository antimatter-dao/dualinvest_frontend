import React, { HTMLProps, useCallback } from 'react'
import MuiCloseIcon from '@mui/icons-material/Close'
import { Link, IconButton, keyframes, styled, Theme } from '@mui/material'
import { SxProps } from '@mui/system'

export function CloseIcon({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      size="large"
      sx={{
        padding: 0,
        position: 'absolute',
        top: '24px',
        right: '24px',
        '&:hover $closeIcon': {
          color: theme => theme.palette.text.primary
        }
      }}
    >
      <MuiCloseIcon sx={{ color: theme => theme.palette.grey[500] }} />
    </IconButton>
  )
}

export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  style,
  sx,
  children,
  underline
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  underline?: 'always' | 'hover' | 'none'
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
      } else {
        event.preventDefault()
        window.location.href = href
      }
    },
    [href, target]
  )
  return (
    <Link
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      style={style}
      sx={sx}
      underline={underline ?? 'none'}
    >
      {children}
    </Link>
  )
}

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

export const AnimatedWrapper = styled('div')(`
pointer-events: none;
display: flex;
align-items: center;
justify-content: center;
height: 100%;
width: 100%;
`)

export const AnimatedImg = styled('div')(`
animation: ${pulse} 800ms linear infinite;
& > * {
  width: 72px;
})
`)

export const Dots = styled('span')(`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`)
