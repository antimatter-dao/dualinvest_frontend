import React from 'react'
import { selectClasses } from '@mui/material/Select'
import { Select as MuiSelect, styled } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  children?: React.ReactNode
  placeholder: string
}

const StyledSelect = styled(MuiSelect, {
  shouldForwardProp: prop => prop !== 'color' && prop !== 'variant' && prop !== 'sx'
})(({ placeholder }) => ({
  [`&.${selectClasses.root}`]: {
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    paddingRight: '0 !important',
    border: 'none',
    '&:before': {
      position: 'absolute',
      content: '"' + placeholder ? `'${placeholder}'` : '' + '"',
      fontSize: 14,
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 1)'
    },
    '&:hover': {
      color: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      }
    },
    '&.Mui-focused': {
      color: 'white',
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      }
    }
  },
  [`&.${selectClasses.icon}`]: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    right: 0,
    top: 8
  },
  [`&.${selectClasses.iconOpen}`]: {
    color: '#FFFFFF'
  }
}))

export default function Select(props: Props) {
  const { children, placeholder } = props

  const blur = () => {
    setTimeout(() => {
      return (document.activeElement as HTMLElement).blur()
    }, 0)
  }

  return (
    <StyledSelect
      autoWidth
      onClose={blur}
      placeholder={placeholder}
      defaultValue=""
      MenuProps={{
        sx: {
          '& .MuiPaper-root': {
            width: 148,
            borderRadius: '14px',
            marginTop: 6,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'transparent'
          },
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
            color: theme => theme.palette.primary.main
          }
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left'
        }
        // getContentAnchorEl: null
      }}
      IconComponent={() => <ExpandMoreIcon sx={{ color: 'currentColor' }} />}
    >
      {children}
    </StyledSelect>
  )
}
