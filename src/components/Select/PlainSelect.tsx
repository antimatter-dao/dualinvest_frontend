import React, { useState } from 'react'
import { Button, Fade, Menu } from '@mui/material'

interface Props {
  children?: React.ReactNode
  placeholder: string
  autoFocus?: boolean
  width?: string
  style?: React.CSSProperties
}

// const StyledSelect = styled(MuiSelect, { shouldForwardProp: () => true })<{ width?: string }>(({ theme, width }) => ({
//   backgroundColor: 'transparent',
//   cursor: 'pointer',
//   width: width ?? '62px',
//   position: 'relative',
//   border: 'none',
//   color: theme.palette.text.primary,
//   opacity: 0.5,

//   // '&.Mui-focused': {
//   //   backgroundColor: 'transparent'
//   // },
//   '&:hover': {
//     opacity: 1
//   },
//   '&.Mui-focused': {
//     opacity: 1
//   }
// }))

export default function Select(props: Props) {
  const { children, placeholder, autoFocus, style } = props

  const [anchorEl, setAnchorEl] = useState<any>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    event.currentTarget && setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        component="a"
        type="button"
        disableRipple
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          borderRadius: 0,
          padding: 0,
          color: theme => theme.palette.text.primary,
          opacity: open ? 1 : 0.5,
          '&:hover': {
            color: theme => theme.palette.text.primary,
            opacity: 1
          },
          '&.Mui-focused': {
            color: theme => theme.palette.text.primary,
            opacity: 1
          },
          ...style
        }}
      >
        {placeholder}
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', stroke: '1px', marginLeft: 8 }}
        >
          <path d="M9.48535 1.24268L5.24271 5.48532L1.00007 1.24268" stroke="currentColor" />
        </svg>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            width: 'max-content',
            borderRadius: '14px',
            marginTop: 6,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.05)',
            backgroundColor: 'transparent',
            '& ul': {
              background: theme => theme.palette.background.paper,
              padding: '10px 20px 18px 20px'
            },
            '& li': {
              fontSize: 13,
              fontWeight: 400,
              color: theme => theme.palette.text.secondary,
              padding: '8px 0',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent'
            },
            '& li:hover': {
              color: theme => theme.palette.text.primary,
              backgroundColor: 'transparent'
            },
            '& .Mui-selected': {
              color: theme => theme.palette.text.primary,
              backgroundColor: 'transparent'
            }
          }
        }}
        autoFocus={autoFocus}
        // autoWidth
        placeholder={placeholder}
        // MenuProps={{

        //   },
        //   anchorOrigin: {
        //     vertical: 'bottom',
        //     horizontal: 'left'
        //   },
        //   transformOrigin: {
        //     vertical: 'top',
        //     horizontal: 'left'
        //   }
        // }}
        // IconComponent={ExpandMoreIcon}
        // input={<InputBase sx={{ paddingRight: '0px' }} />}
        // renderValue={() => ''}
      >
        {children}
      </Menu>
    </>
  )
}
