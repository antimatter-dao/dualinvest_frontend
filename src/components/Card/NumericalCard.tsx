import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import Card from 'components/Card/Card'

interface Props {
  title?: string
  valueColor?: string
  primary?: boolean
  width?: string | number
  height?: string | number
  value?: string | React.ReactNode
  subValue?: string
  unit?: string | JSX.Element
  unitSize?: string
  fontSize?: string
  gray?: boolean
  rate?: string
  dayChange?: string
  actions?: React.ReactNode
  children?: React.ReactNode
  border?: boolean
  padding?: string
  gap?: string | number
  unitFontSize?: number | string
  valueMt?: number | string
}

export default function NumericalCard(props: Props) {
  const {
    title,
    primary,
    value,
    subValue,
    unit,
    unitSize,
    fontSize,
    gray,
    width,
    height,
    rate,
    dayChange,
    actions,
    children,
    border,
    padding,
    valueColor,
    valueMt
  } = props
  const theme = useTheme()

  return (
    <Card
      primary={primary}
      gray={gray}
      width={width || '100%'}
      style={{ position: 'relative', border: border ? '1px solid #00000010' : undefined, height: height || 'auto' }}
    >
      <Box
        sx={{
          padding: padding ?? '20px 20px 16px',
          gap: {
            xs: 10,
            md: 24
          },
          height: height || 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {(title || rate) && (
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
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            color: valueColor ? valueColor : primary ? theme.palette.primary.contrastText : theme.palette.text.primary,
            marginTop: valueMt ?? 0
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
          {unit && (
            <Typography sx={{ fontSize: unitSize || 16, fontWeight: 700, ml: 4, lineHeight: 1 }}>{unit}</Typography>
          )}
          {dayChange && (
            <Box
              component="div"
              borderRadius={22}
              color="#31B047"
              bgcolor="rgba(49, 176, 71, 0.16)"
              fontSize={14}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={120}
              height={24}
              ml={10}
            >
              <Typography
                sx={{
                  color: '#11BF2D',
                  fontSize: '12px'
                }}
              >
                {dayChange}
              </Typography>
            </Box>
          )}
        </Box>
        {subValue && (
          <Typography sx={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }} align="left">
            {subValue}
          </Typography>
        )}
        {actions && <Box mt={20}>{actions}</Box>}
      </Box>
      <Box sx={{ position: { xs: 'relative', sm: 'unset' } }}>
        <Box
          sx={{
            position: { xs: 'unset', sm: 'absolute' },
            right: 20,
            top: '50%',
            transform: { xs: 'translateY(-20px)', sm: 'translateY(-50%)' },
            borderRadius: 40,
            padding: { xs: '0 20px', sm: 0 }
            // mt: { xs: '20px', sm: 0 }
          }}
        >
          {children}
        </Box>
      </Box>
    </Card>
  )
}
