import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Typography, Paper, styled } from '@mui/material'
import { routes } from 'constants/routes'
import { Dots } from 'theme/components'
import useBreakpoint from 'hooks/useBreakpoint'

const Wrapper = styled('div')({
  height: '100vh',
  width: '100%',
  top: 0,
  left: 0,
  position: 'absolute',
  zIndex: 1111,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const Backdrop = styled('div')({
  backgroundColor: '#ffffff50',
  zIndex: 1111,
  height: '100vh',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  backdropFilter: 'blur(2px)'
})

const availablePath = [routes.stake, routes.dashboard]

export default function ComingSoonMoadal() {
  const [isOpen, setIsOpen] = useState(false)
  const isDownSm = useBreakpoint('md')
  const location = useLocation()
  useEffect(() => {
    if (availablePath.includes(location.pathname) /*&& !isDownSm*/) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [location.pathname])

  return (
    <>
      {isOpen && (
        <Wrapper id="ComingSoon">
          <Paper
            sx={{
              zIndex: 1112,
              width: 'calc(100% - 40px)',
              maxWidth: '500px',
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '20px',
              marginLeft: theme => ({ xs: 0, md: theme.width.sidebar }),
              boxShadow: `0px 6px 6px -3px rgb(242 245 250 / 90%), 0px 10px 14px 1px rgb(242 245 250 / 80%), 0px 4px 18px 3px rgb(242 245 250 / 70%)`
              // background: theme => theme.palette.background.default
              // // border: theme => `1px solid ${theme.palette.primary.main}`
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '24px'
              }}
            >
              Coming Soon <Dots />
            </Typography>
            <div>{isDownSm ? 'Mobile version' : 'This section'} is still implemeting.</div>
            <div>Please come back later</div>
          </Paper>
          <Backdrop
            sx={{
              backgroundColor: isDownSm ? '#F2F5FA90' : '#ffffff50',
              backdropFilter: isDownSm ? 'blur(10px)' : 'blur(2px)'
            }}
          />
        </Wrapper>
      )}
    </>
  )
}
