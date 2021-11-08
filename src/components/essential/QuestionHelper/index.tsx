import { useCallback, useState } from 'react'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { styled } from '@mui/material'
import Tooltip from './Tooltip'

const QuestionWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.2rem',
  border: 'none',
  background: 'none',
  outline: 'none',
  cursor: 'default',
  borderRadius: '36px',
  backgroundColor: theme.bgColor.bg2,
  color: theme.textColor.text2,
  '&:hover, :focus': {
    opacity: 0.7
  }
}))

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
  color: '#ffffff',
  '&:hover, :focus': {
    opacity: 0.7
  }
})

const QuestionMark = styled('span')({
  fontSize: '1rem'
})

export default function QuestionHelper({ text, size = 14 }: { text: string; size?: number }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <HelpOutlineOutlinedIcon sx={{ height: size, width: size }} />
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
