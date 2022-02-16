import { Box } from '@mui/material'

type StatusType = 'progressing' | 'finished' | 'completed' | 'failed' | 'unexercised' | 'exercised'
interface Props {
  status: StatusType
  width?: number | string
}

interface Style {
  statusText: string
  color: string
  bgColor: string
  borderColor?: string
}

const statusStyles: { [key in StatusType]: Style } = {
  progressing: {
    statusText: 'Progressing',
    color: '#18A0FB',
    bgColor: '#18A0FB16'
  },
  finished: {
    statusText: 'Finished',
    color: '#31B047',
    bgColor: 'rgba(49, 176, 71, 0.16)'
  },
  completed: { statusText: 'Completed', color: '#11BF2D', bgColor: 'rgba(17, 191, 45, 0.16)' },
  failed: { statusText: 'Failed', color: '#FF0000', bgColor: 'rgba(255,3,3,0.16)' },
  unexercised: { statusText: 'Unexercised', color: '#F0B90B', bgColor: '#F0B90B26' },
  exercised: { statusText: 'Exercised', color: '#31B047', bgColor: 'rgba(49, 176, 71, 0.16)' }
}

export default function StatusTag(props: Props) {
  const { status, width } = props

  return (
    <Box
      component="span"
      borderRadius={22}
      sx={{ border: '1px solid ' + statusStyles[status]?.borderColor ?? 'transparent' }}
      color={statusStyles[status].color}
      bgcolor={statusStyles[status].bgColor}
      fontSize={14}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={width || 100}
      height={36}
      fontWeight={400}
    >
      {statusStyles[status].statusText}
    </Box>
  )
}
