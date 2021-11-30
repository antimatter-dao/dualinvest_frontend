import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card/Card'

interface Props {
  title?: string
  primary?: boolean
  width?: string | number
  height?: string | number
  value?: string
  subValue?: string
  unit?: string
  fontSize?: string
  gray?: boolean
  rate?: string
  actions?: React.ReactNode
  children?: React.ReactNode
  border?: boolean
}

export default function NumericalCard(props: Props) {
  const {
    title,
    primary,
    value,
    subValue,
    unit,
    fontSize,
    gray,
    width,
    height,
    rate,
    actions,
    children,
    border
  } = props
  const theme = useTheme()

  return (
    <Card
      primary={primary}
      gray={gray}
      width={width || '100%'}
      style={{ position: 'relative', border: border ? '1px solid #00000010' : undefined }}
    >
      {children}
      <Box
        sx={{
          padding: '20px',
          gap: '15px',
          height: height || 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {title ||
          (rate && (
            <Box display="flex">
              {title && (
                <Typography
                  variant="inherit"
                  color={primary ? theme.palette.primary.contrastText : theme.palette.text.secondary}
                >
                  {title}
                </Typography>
              )}
              {rate && (
                <Box
                  sx={{
                    ml: 15,
                    backgroundColor: 'rgba(17, 191, 45, 0.16)',
                    width: '56px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px'
                  }}
                >
                  <Typography
                    sx={{
                      color: '#11BF2D'
                    }}
                  >
                    +{rate}%
                  </Typography>
                </Box>
              )}
            </Box>
          ))}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            color: primary ? theme.palette.primary.contrastText : theme.palette.text.primary
          }}
        >
          <Typography
            sx={{
              fontSize: fontSize || 24,
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
          {unit && <Typography sx={{ fontSize: 16, fontWeight: 700, ml: 4, lineHeight: 1 }}>{unit}</Typography>}
        </Box>
        {subValue && <Typography sx={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }}>{subValue}</Typography>}
        {actions && <Box mt={20}>{actions}</Box>}
      </Box>
    </Card>
  )
}
