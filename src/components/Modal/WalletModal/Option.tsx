import React from 'react'
import { styled } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import { ExternalLink } from 'theme/components'
import LogoText from 'components/LogoText'

const GreenCircle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  '& div ': {
    height: 8,
    width: 8,
    marginRight: 8,
    backgroundColor: theme.palette.success.main,
    borderRadius: '50%'
  }
}))

export default function Option({
  link = null,
  clickable = true,
  onClick = null,
  header,
  icon,
  active = false,
  id
}: {
  link?: string | null
  clickable?: boolean
  onClick?: (() => void) | null
  header: React.ReactNode
  icon: string
  active?: boolean
  id: string
}) {
  const content = (
    <>
      <OutlineButton
        key={id}
        width="320px"
        onClick={onClick}
        color={active ? 'transparent' : undefined}
        disabled={!clickable || active}
      >
        {active ? (
          <GreenCircle>
            <div />
          </GreenCircle>
        ) : null}
        <LogoText logo={icon} text={header} />
      </OutlineButton>
    </>
  )
  if (link) {
    return <ExternalLink href={link}>{content}</ExternalLink>
  }
  return content
}
