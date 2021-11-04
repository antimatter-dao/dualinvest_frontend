import React from 'react'
import { Select as MuiSelect, makeStyles, createStyles, Theme } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

interface Props {
  children?: React.ReactNode
  placeholder: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '55px',
      cursor: 'pointer',
      color: 'rgba(255, 255, 255, 0.5)',
      paddingRight: '0 !important',
      '&::before': {
        content: ({ placeholder }: Props) => '"' + placeholder + '"',
        position: 'absolute',
        fontSize: 14,
        fontWeight: 400
      },
      '&:hover': {
        color: 'rgba(255, 255, 255, 1)'
      }
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 16,
      right: 0,
      top: 8
    },
    iconOpen: {
      color: '#FFFFFF'
    },
    paper: {
      width: 148,
      borderRadius: 14,
      marginTop: 6,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'transparent',
      '& ul': {
        background: '#0F0F10',
        padding: '10px 20px 18px 20px'
      },
      '& li': {
        fontSize: 13,
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.4)',
        padding: '8px 0',
        border: 'none',
        outline: 'none'
      },
      '& li:hover': {
        color: theme.palette.primary.main
      }
    },
    base: {
      width: 'inherit',
      '&.Mui-focused': {
        color: 'white',
        '& .MuiSelect-root:before': {
          color: 'rgba(255, 255, 255, 1)'
        }
      }
    }
  })
)

export default function Select(props: Props) {
  const classes = useStyles(props)
  const { children } = props

  const blur = () => {
    setTimeout(() => {
      return (document.activeElement as HTMLElement).blur()
    }, 0)
  }

  return (
    <MuiSelect
      disableUnderline
      className={classes.base}
      classes={{ root: classes.root, icon: classes.icon, iconOpen: classes.iconOpen }}
      onClose={blur}
      MenuProps={{
        classes: { paper: classes.paper },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left'
        },
        getContentAnchorEl: null
      }}
      IconComponent={ExpandMoreIcon}
    >
      {children}
    </MuiSelect>
  )
}
