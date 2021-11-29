import { Divider as MuiDivider, DividerProps, useTheme } from '@mui/material'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  //extension must be in px
  color?: string
  extension?: number
}

export default function Divider({ extension, orientation, color, ...props }: Props & DividerProps) {
  const theme = useTheme()

  return (
    <MuiDivider
      {...props}
      sx={{
        width: extension ? `calc(100% + ${extension * 2}px` : orientation === 'vertical' ? '1px' : '100%',
        // border: 'none',
        height: orientation === 'vertical' ? '100%' : '1px',
        backgroundColor: color ? color : orientation === 'vertical' ? theme.textColor.text1 : theme.bgColor.bg4,
        margin: extension ? `0 -${extension}px` : '0',
        ...props?.sx
      }}
    />
  )
}
