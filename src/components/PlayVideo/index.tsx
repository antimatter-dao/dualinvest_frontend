import { useCallback, useState, useEffect } from 'react'
import { IconButton, Dialog, Box, Typography } from '@mui/material'
import { ReactComponent as PlayButton } from 'assets/svg/play_button.svg'
import useBreakpoint from 'hooks/useBreakpoint'

export function PlayVideo() {
  const [isOpen, setIsOpen] = useState(false)
  const isDownMd = useBreakpoint('md')
  const [width, setWidth] = useState(500)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  useEffect(() => {
    const resize = () => {
      console.log(999, document)
      setWidth((document.documentElement.clientWidth ?? 500) - 30)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <IconButton onClick={handleOpen}>
        <PlayButton />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background:
              'linear-gradient(162.4deg, rgba(250, 250, 250, 0.87) 17.73%, rgba(122, 122, 122, 0.29) 94.19%);',
            borderRadius: 3,
            backdropFilter: 'blur(95px)',
            maxWidth: 'unset',
            margin: 0
          }
        }}
        BackdropProps={{
          sx: {
            ...{
              backgroundColor: 'rgba(0,0,0,.8)'
            }
          }
        }}
      >
        <Box padding={'15px'}>
          <video width={isDownMd ? width : '600px'} controls>
            <source
              src={'https://github.com/antimatter-dao/antimatter-assets/blob/main/dual-invest-vedio.mp4?raw=true'}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <Box display="flex" width="100%" justifyContent={'space-between'} alignItems="center">
            <Typography fontSize={24}>How it work</Typography>
            <IconButton onClick={handleClose}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M20.144 9.6L16 13.744L11.856 9.6L9.6 11.856L13.744 16L9.6 20.144L11.856 22.4L16 18.256L20.144 22.4L22.4 20.144L18.256 16L22.4 11.856L20.144 9.6ZM16 0C7.152 0 0 7.152 0 16C0 24.848 7.152 32 16 32C24.848 32 32 24.848 32 16C32 7.152 24.848 0 16 0ZM16 28.8C8.944 28.8 3.2 23.056 3.2 16C3.2 8.944 8.944 3.2 16 3.2C23.056 3.2 28.8 8.944 28.8 16C28.8 23.056 23.056 28.8 16 28.8Z"
                  fill="#000505"
                  fillOpacity="0.7"
                />
              </svg>
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}
