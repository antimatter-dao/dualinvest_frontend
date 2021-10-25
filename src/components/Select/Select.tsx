import React from 'react'
import { Select as MuiSelect, makeStyles, createStyles, Theme } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'

interface Props {
  children?: React.ReactNode
  onChange?: (e: any) => void
  defaultValue?: any
  value?: string | string[]
  disabled?: boolean
  size?: 'large' | 'small'
  selected?: boolean
  placeholder?: string
  width?: string
  multiple?: boolean
  renderValue?: any
  primary?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: (props: Props) => (props.width ? props.width : '100%'),
      height: (props: Props) => (props.size === 'small' ? 36 : 48),
      borderRadius: (props: Props) => (props.size === 'small' ? 6 : theme.shape.borderRadius),
      paddingLeft: (props: Props) => (props.size === 'small' ? 8 : 24),
      cursor: (props: Props) => (props.disabled ? 'cursor' : 'pointer'),
      boxSizing: 'border-box',
      backgroundColor: (props: Props) => (props.primary ? theme.palette.primary.main : theme.textColor.text5),
      color: theme.palette.primary.contrastText,
      display: 'flex',
      alignItems: 'center',
      '&:focus': {
        backgroundColor: theme.bgColor.bg3,
        borderRadius: (props: Props) => (props.size === 'small' ? 6 : theme.shape.borderRadius)
      },
      '&:hover': {
        backgroundColor: (props: Props) =>
          props.disabled
            ? props.primary
              ? theme.palette.primary.main
              : theme.textColor.text5
            : theme.palette.primary.main,
        '&:before': {
          color: theme.textColor.text1
        }
      },
      '&::before': {
        content: ({ value, defaultValue, placeholder }: Props) =>
          !value && !defaultValue && placeholder ? '"' + placeholder + '"' : '""',
        position: 'absolute',
        left: 24,
        top: 14,
        zIndex: 2,
        color: (props: Props) => (props.primary ? theme.palette.primary.contrastText : theme.textColor.text3),
        fontSize: 16,
        fontWeight: 400
      }
    },
    icon: {
      right: (props: Props) => (props.size === 'small' ? 6.51 : 15),
      color: '#FFFFFF',
      display: (props: Props) => (props.disabled ? 'none' : 'block'),
      opacity: (props: Props) => (props.size === 'small' ? 0.5 : 1),
      fontSize: (props: Props) => (props.size === 'small' ? '18px' : '24px'),
      top: '50%',
      transform: 'translateY(-50%)'
    },
    paper: {
      width: (props: Props) => (props.size === 'small' ? 172 : 176),
      borderRadius: theme.shape.borderRadius,
      marginTop: 8,
      backgroundColor: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      '& ul': {
        background: '#0F0F10',
        padding: 0
      },
      '& li': {
        fontSize: 16,
        fontWeight: 500,
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0'
      },
      '& li:hover': {
        backgroundColor: 'rgba(255,255,255,0.05)'
      },
      '& li:last-child': {
        borderBottom: 'none'
      },
      '& .MuiListItem-root': {
        '&::before': {
          content: '""',
          width: 30,
          height: 20,
          display: 'flex',
          justifyContent: 'center'
        },
        '&.Mui-selected::before': {
          content: `url(${SelectedIcon})`,
          width: 30,
          height: 20,
          display: 'flex',
          justifyContent: 'center'
        }
      }
    },
    base: {
      width: (props: Props) => props.width ?? '100%',
      borderRadius: theme.shape.borderRadius,
      border: '1px solid transparent',
      '&.Mui-focused': {
        borderColor: theme.palette.primary.main
      }
    }
  })
)

export default function Select(props: Props) {
  const classes = useStyles(props)
  const { value, defaultValue, disabled, onChange, children, placeholder = '', multiple, renderValue } = props

  return (
    <MuiSelect
      className={classes.base}
      displayEmpty
      disableUnderline
      classes={{ root: classes.root, icon: classes.icon }}
      defaultValue={defaultValue ? defaultValue : placeholder}
      value={value ? value : ''}
      disabled={disabled}
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
      onChange={onChange}
      multiple={multiple}
      renderValue={renderValue}
    >
      {children}
    </MuiSelect>
  )
}
