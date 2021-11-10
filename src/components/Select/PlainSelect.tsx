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
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '16px',
    fontSize: '16px'
  },
  // '&.Mui-focused': {
  //   backgroundColor: 'transparent'
  // },
  '&:hover': {
    color: 'rgba(255, 255, 255, 1)',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
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
            width: 148,
            borderRadius: '14px',
            marginTop: 6,
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
              outline: 'none',
              backgroundColor: 'transparent'
            },
            '& li:hover': {
              color: theme => theme.palette.primary.main,
              backgroundColor: 'transparent'
            },
            '& .Mui-selected': {
              color: theme => theme.palette.primary.main,
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
