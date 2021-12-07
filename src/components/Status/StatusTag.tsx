import { Box } from '@mui/material'

interface Props {
  status: 'progressing' | 'recruited' | 'completed' | 'failed'
}

export default function StatusTag(props: Props) {
  const { status } = props
  const statusStyles = {
    progressing: { statusText: 'Progressing', color: '#18A0FB', bgColor: 'rgba(24, 160, 251, 0.16)' },
    recruited: { statusText: 'Recruited', color: '#31B047', bgColor: 'rgba(49, 176, 71, 0.16)' },
    completed: { statusText: 'Completed', color: '#11BF2D', bgColor: 'rgba(17, 191, 45, 0.16)' },
    failed: { statusText: 'Failed', color: '#FF0000', bgColor: 'rgba(255,3,3,0.16)' }
  }

  return (
    <Box
      component="div"
      borderRadius={22}
      color={statusStyles[status].color}
      bgcolor={statusStyles[status].bgColor}
      fontSize={14}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={100}
      height={36}
    >
      {statusStyles[status].statusText}
    </Box>
  )
}
