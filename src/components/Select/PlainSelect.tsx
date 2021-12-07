import React from 'react'
import { Select as MuiSelect, styled, InputBase } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  children?: React.ReactNode
  placeholder: string
}

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  backgroundColor: 'transparent',
  cursor: 'pointer',
  width: '72px',
  position: 'relative',
  border: 'none',
  color: theme.palette.text.primary,
  opacity: 0.5,
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary,
    right: '16px',
    fontSize: '16px'
  },
  // '&.Mui-focused': {
  //   backgroundColor: 'transparent'
  // },
  '&:hover': {
    opacity: 1,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  '&.Mui-focused': {
    opacity: 1
  }
}))

export default function Select(props: Props) {
  const { children, placeholder } = props

  return (
    <StyledSelect
      sx={{
        '&:before': {
          position: 'absolute',
          zIndex: -1,
          content: '"' + placeholder ? `'${placeholder}'` : '' + '"',
          fontSize: 14,
          fontWeight: 400
        }
      }}
      autoWidth
      placeholder={placeholder}
      MenuProps={{
        sx: {
          '& .MuiPaper-root': {
            width: 'max-content',
            borderRadius: '14px',
            marginTop: 6,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.05)',
            backgroundColor: 'transparent',
            '& ul': {
              background: theme => theme.palette.background.paper,
              padding: '10px 20px 18px 20px'
            },
            '& li': {
              fontSize: 13,
              fontWeight: 400,
              color: theme => theme.palette.text.secondary,
              padding: '8px 0',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent'
            },
            '& li:hover': {
              color: theme => theme.palette.text.primary,
              backgroundColor: 'transparent'
            },
            '& .Mui-selected': {
              color: theme => theme.palette.text.primary,
              backgroundColor: 'transparent'
            }
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
      }}
      IconComponent={ExpandMoreIcon}
      input={<InputBase />}
      renderValue={() => ''}
    >
      {children}
    </StyledSelect>
  )
}
