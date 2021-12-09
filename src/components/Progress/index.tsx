import { Box, Typography, LinearProgress, linearProgressClasses, styled } from '@mui/material'

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'rgba(37, 37, 37, 0.1)'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main
  }
}))

export default function Progress({ val, total, unit }: { val: number; total: number; unit: string }) {
  const value = (val / total) * 100

  return (
    <Box display="grid" sx={{ width: 'max-content' }} columnGap={6} rowGap={4}>
      <Typography
        fontSize={12}
        sx={{ gridRowStart: 1, gridRowEnd: 'span 2', textAlign: 'center', display: 'flex', alignItems: 'flex-end' }}
      >
        {value | 0}%
      </Typography>
      <Typography
        fontSize={12}
        sx={{ gridColumnStart: 2, gridColumnEnd: 'span 1', textAlign: 'center' }}
      >{`${val} ${unit} / ${total} ${unit}`}</Typography>
      <StyledLinearProgress variant="determinate" value={value} sx={{ width: 120 }} />
    </Box>
  )
}

export function SimpleProgress({
  val,
  total,
  hideValue,
  width
}: {
  val: number
  total: number
  hideValue?: boolean
  width?: string
}) {
  const value = (val / total) * 100
  return (
    <Box display="flex" sx={{ width: width ?? 'max-content' }} alignItems="center">
      {!hideValue && <Typography mr={8}>{value | 0}%</Typography>}
      <StyledLinearProgress variant="determinate" value={value} sx={{ width: width ?? '100px' }} />
    </Box>
  )
}
