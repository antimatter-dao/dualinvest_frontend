import styled from 'styled-components'

export const SwitchTabWrapper = styled('div')({
  borderBottom: '1px solid rgb(255,255,255, 0.1)',
  whiteSpace: 'nowrap'
})

export const Tab = styled('button')(({ selected }: { selected: boolean }) => ({
  border: 'none',
  background: 'none',
  padding: '14px 0',
  marginRight: '40px',
  fontSize: '16px',
  fontWeight: 700,
  color: selected ? 'rgba(255,255,255, 1)' : 'rgba(255,255,255, 0.4)',
  borderBottom: selected ? '3px solid rgba(255,255,255, 1)' : 'transparent',
  transition: '0.3s',
  cursor: 'pointer',
  '&:hover': {
    color: '#fff'
  }
}))
