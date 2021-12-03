import { Box } from '@mui/material'

interface Props {
  status: string
}

export default function StatusTag(props: Props) {
  const { status } = props
  let color, bgcolor, statustext

  switch (status) {
    case 'progressing':
      statustext = 'Progressing'
      color = '#18A0FB'
      bgcolor = 'rgba(24, 160, 251, 0.16)'
      break
    case 'recruited':
      statustext = 'Recruited'
      color = '#31B047'
      bgcolor = 'rgba(49, 176, 71, 0.16)'
      break
    case 'completed':
      statustext = 'Completed'
      color = '#11BF2D'
      bgcolor = 'rgba(17, 191, 45, 0.16)'
      break
    case 'failed':
      statustext = 'Failed'
      color = '#FF0000'
      bgcolor = 'rgba(255,3,3,0.16)'
      break
    default:
      statustext = 'undefined'
      color = '#000000'
      bgcolor = 'rgba(0,0,0,0.16)'
  }

  return (
    <Box
      component="div"
      borderRadius={22}
      color={color}
      bgcolor={bgcolor}
      fontSize={14}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={100}
      height={36}
    >
      {statustext}
    </Box>
  )
}
