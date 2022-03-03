import { useCallback, useState } from 'react'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { styled, Typography } from '@mui/material'
import Tooltip from './Tooltip'
import dayjs from 'dayjs'

const QuestionWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.2rem',
  border: 'none',
  background: 'none',
  outline: 'none',
  cursor: 'default',
  borderRadius: '36px',
  color: '#828282',
  '&:hover, :focus': {
    opacity: 0.7
  }
})

const LightQuestionWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.2rem',
  border: 'none',
  background: 'none',
  outline: 'none',
  cursor: 'default',
  borderRadius: '36px',
  width: '12px',
  height: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff'
})

const QuestionMark = styled('span')({
  fontSize: '1rem'
})

export default function QuestionHelper({
  text,
  size = 14,
  title
}: {
  text: string | undefined
  size?: number
  title?: any
}) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text ? text : ''} show={show}>
        <QuestionWrapper
          onClick={open}
          onMouseEnter={text ? open : undefined}
          onMouseLeave={close}
          sx={{
            backgroundColor: theme => (title ? 'transparent' : theme.palette.background.paper),
            '&:hover, :focus': {
              opacity: title ? 1 : 0.7
            }
          }}
        >
          {title ? title : <HelpOutlineOutlinedIcon sx={{ height: size, width: size }} />}
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}

export function LightQuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <LightQuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <QuestionMark>?</QuestionMark>
        </LightQuestionWrapper>
      </Tooltip>
    </span>
  )
}

export function ExpireDateAQuestionHelper({ expireAt, showIcon }: { expireAt: number; showIcon: boolean }) {
  return (
    <QuestionHelper
      text={dayjs(expireAt).format('MMM-DD-YYYY') + ' 08:30:00 AM UTC'}
      title={
        showIcon ? (
          undefined
        ) : (
          <Typography color="#161616" component="span">
            {dayjs(expireAt).format('DD MMM YYYY')}
          </Typography>
        )
      }
    />
  )
}
