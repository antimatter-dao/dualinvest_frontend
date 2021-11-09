import React from 'react'
import { styled } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const Wrapper = styled('div')({
  display: 'flex',
  width: 'fit-content',
  alignItems: 'center',
  fontWeight: 500,
  fontSize: 14,
  marginRight: 20,
  position: 'relative',
  color: 'rgba(255,255,255,0.5)',
  height: 36,
  padding: '5px 15px',
  cursor: 'pointer',
  '& .dropdown_wrapper': {
    display: 'none'
  },
  '&>span': {
    marginRight: 6,
    display: 'flex',
    alignItems: 'center',
    '&>img, &>svg': {
      marginRight: 5
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    '& .dropdown_wrapper': {
      display: 'block',
      top: '100%',
      left: '-20px',
      height: '10px',
      position: 'absolute',
      width: '172px',
      '&>div': {
        height: 'auto',
        marginTop: '10px'
      }
    }
  }
})

const Dropdown = styled('div')({
  zIndex: 10,
  height: 0,
  position: 'absolute',
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: '#1C1C1C',
  flexDirection: 'column',
  width: 172,
  '&>div': {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '14px 17px 14px 40px',
    transition: '0.5s',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    '&:last-child': {
      border: 'none'
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  }
})

export default function HoverSelect({
  selectedDisplay,
  list,
  onClickGenerator
}: {
  selectedDisplay: string | number | React.ReactNode
  list: string[] | React.ReactNode[]
  onClickGenerator: (item: any) => () => void
}) {
  return (
    <Wrapper>
      {selectedDisplay}
      <ExpandMoreIcon sx={{ fontSize: '18px' }} />
      <div className="dropdown_wrapper">
        <Dropdown>
          {list.map((item, idx) => (
            <div key={idx} onClick={onClickGenerator(item)}>
              {item}
            </div>
          ))}
        </Dropdown>
      </div>
    </Wrapper>
  )
}
