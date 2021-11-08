import { Divider as MuiDivider, DividerProps, useTheme } from '@mui/material'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  //extension must be in px
  extension?: number
}

export default function Divider({ extension, orientation, ...props }: Props & DividerProps) {
  const theme = useTheme()

  return (
    <MuiDivider
      {...props}
      sx={{
        width: extension ? `calc(100% + ${extension * 2}px` : orientation === 'vertical' ? 1 : '100%',
        border: 'none',
        height: orientation === 'vertical' ? '100%' : '1px',
        backgroundColor: orientation === 'vertical' ? theme.textColor.text1 : theme.bgColor.bg4,
        margin: extension ? `0 -${extension}px` : '0'
      }}
    />
  )
}
