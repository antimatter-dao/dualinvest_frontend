import { ChangeEvent } from 'react'
import { Switch, styled } from '@mui/material'
import { switchClasses } from '@mui/material/Switch'

const StyledSwitch = styled(Switch)(({ theme }) => ({
  [`&.${switchClasses.root}`]: {
    width: 44,
    height: 24,
    padding: 0
  },
  [`& .${switchClasses.switchBase}`]: {
    padding: '4px'
  },
  [`& .${switchClasses.thumb}`]: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF'
  },
  [`& .${switchClasses.track}`]: {
    width: 44,
    height: 24,
    color: theme.palette.primary.contrastText,
    opacity: '1 !important',
    backgroundColor: '#D8D9DC',
    border: '1px solid transparent',
    borderRadius: '49px',
    position: 'relative',
    '&:before, &:after': {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      width: '50%',
      transform: 'translateY(-50%)',
      textAlign: 'center'
    }
  },
  [`& .${switchClasses.checked}`]: {
    [`&.${switchClasses.switchBase}`]: {
      transform: 'translateX(20px)',
      '&:hover': {}
    },
    // [`& .${switchClasses.thumb}`]: {
    //   backgroundColor: theme.palette.primary.main
    // },
    [`& + .${switchClasses.track}`]: {
      background: theme.palette.primary.main + ' !important',
      opacity: '1 !important',
      border: '1px solid transparent',
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
  onChange,
  disabled
}: {
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}) {
  return <StyledSwitch checked={checked} onChange={onChange} disabled={disabled} />
}
