import React from 'react'
import { Select, Box, Typography, SelectChangeEvent } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Placehoder = ({ text }: { text: string }) => {
  return (
    <Box marginLeft={'12px'} sx={{ fontWeight: 400 }} style={{ opacity: 0.6 }}>
      <Typography variant={'body2'}>{text}</Typography>
    </Box>
  )
}

export default function OutlineSelect({
  children,
  defaultValue,
  disabled,
  onChange,
  placeholder
}: {
  children: React.ReactNode
  defaultValue: any
  disabled?: boolean
  onChange: (e: SelectChangeEvent<any>) => void
  placeholder?: string
}) {
  return (
    <Select
      disableUnderline
      sx={{
        '& .MuiSelect-root': {
          width: 128,
          height: 32,
          borderRadius: 4,
          boxSizing: 'border-box',
          cursor: disabled ? 'cursor' : 'pointer',
          opacity: 0.6,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        '& .MuiSelect-icon': {
          right: 10,
          color: '#FFFFFF',
          opacity: 0.8
        }
      }}
      defaultValue={defaultValue}
      disabled={disabled}
      MenuProps={{
        sx: {
          borderRadius: 14,
          marginTop: 8,
          overflow: 'hide',
          '& ul': {
            background: '#1f1f1f',
            outline: 'none',
            padding: 0
          },
          '& li': {
            fontSize: 12,
            fontWeight: 400,
            color: '#FFFFFF',
            border: '1px solid transparent',
            // borderBottomColor: 'hsla(0,0%,100%,.12)',
            display: 'flex',
            alignItems: 'center'
            // padding: 14,
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
      IconComponent={ExpandMoreIcon}
      displayEmpty={true}
      onChange={onChange}
      renderValue={() => {
        return <Placehoder text={placeholder ?? 'Token: All'} />
      }}
    >
      {children}
    </Select>
  )
}
