import { ChangeEvent } from 'react'
import { Switch, Theme } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'

interface Props {
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 80,
      height: 36,
      padding: 0
    },
    switchBase: {
      padding: '8px'
    },
    thumb: {
      width: 20,
      height: 20,
      backgroundColor: '#FFFFFF'
    },
    track: {
      width: 80,
      height: 36,
      opacity: '1 !important',
      backgroundColor: 'transparent',
      border: '1px solid rgba(255,255,255,0.8)',
      borderRadius: 49,
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
    checked: {
      '&$switchBase': {
        transform: 'translateX(44px)',
        '&:hover': {}
      },
      '& $thumb': {
        backgroundColor: theme.palette.primary.main
      },
      '& + $track': {
        background: 'transparent !important',
        opacity: '1 !important',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 49,
        '&:before': {
          opacity: 1
        },
        '&:after': {
          opacity: 0
        }
      }
    }
  })
)

export default function SwitchToggle(props: Props) {
  const classes = useStyles()
  const { checked, onChange } = props

  return <Switch classes={{ ...classes }} checked={checked} onChange={onChange} />
}
