import React, { HTMLProps, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { X } from 'react-feather'
import { Link } from '@material-ui/core'

export const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
  > * {
    stroke: ${({ theme }) => theme.text5};
  }
`

export function ExternalLink({
  target = '_blank',
  href,
  rel = 'noopener noreferrer',
  style,
  className,
  children,
  underline
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
  style?: React.CSSProperties
  className?: string
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
      className={className}
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

export const AnimatedWrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

export const AnimatedImg = styled.div`
  animation: ${pulse} 800ms linear infinite;
  & > * {
    width: 72px;
  }
`
