import { ChangeEvent } from 'react'
import { Switch, styled } from '@mui/material'
import { switchClasses } from '@mui/material/Switch'

const StyledSwitch = styled(Switch)(({ theme }) => ({
  [`&.${switchClasses.root}`]: {
    width: 80,
    height: 36,
    padding: 0
  },
  [`& .${switchClasses.switchBase}`]: {
    padding: '8px'
  },
  [`& .${switchClasses.thumb}`]: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF'
  },
  [`& .${switchClasses.track}`]: {
    width: 80,
    height: 36,
    opacity: '1 !important',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: '49px',
    position: 'relative',
    '&:before, &:after': {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      width: '50%',
      transform: 'translateY(-50%)',
      textAlign: 'center'
    },
    '&:before': {
      content: '"On"',
      left: 4,
      opacity: 0
    },
    '&:after': {
      content: '"Off"',
      right: 4
    }
  },
  [`& .${switchClasses.checked}`]: {
    [`&.${switchClasses.switchBase}`]: {
      transform: 'translateX(44px)',
      '&:hover': {}
    },
    [`& .${switchClasses.thumb}`]: {
      backgroundColor: theme.palette.primary.main
    },
    [`& + .${switchClasses.track}`]: {
      background: 'transparent !important',
      opacity: '1 !important',
      border: '1px solid rgba(255,255,255,0.8)',
      borderRadius: '49px',
      '&:before': {
        opacity: 1
      },
      '&:after': {
        opacity: 0
      }
    }
  }
}))

export default function SwitchToggle({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return <StyledSwitch checked={checked} onChange={onChange} />
}
