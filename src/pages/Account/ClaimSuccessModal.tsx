import { useCallback, useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Box, Grid, Typography } from '@mui/material'
import Card, { OutlinedCard } from 'components/Card/Card'
import Modal from 'components/Modal'
import clapUrl from 'assets/images/clap.png'
import antimatterLogoUrl from 'assets/svg/antimatter.svg'
import ImageComponent from 'components/Image'
import Divider from 'components/Divider'
import Button from 'components/Button/Button'

export default function ClaimSuccessModal() {
  const handleClick = useCallback(() => {}, [])

  const SuccessModal = useCallback(
    () => (
      <Card width="400px">
        <Box padding="32px 28px" display="grid" justifyItems={'center'} width="100%" gap={12}>
          <Typography color="primary" fontSize={20}>
            The benefits are great !
          </Typography>
          <ImageComponent src={clapUrl} style={{ width: 80, height: 80, objectFit: 'cover' }} />
          <Box display="flex" gap="20px">
            <Typography variant="inherit">
              APY:{' '}
              <Typography component="span" color="primary" variant="inherit">
                140.12%
              </Typography>
            </Typography>
            <Divider orientation="vertical" color="#00000024" />
            <Typography variant="inherit">Order ID: 26</Typography>
          </Box>
          <Typography color="primary" fontWeight={600} fontSize={30}>
            +0.454241 BTC
          </Typography>
          <Card gray width="100%">
            <Grid container width="100%" padding="14px 20px">
              <Grid item xs={4}>
                <Typography fontSize={12} color={'#16161690'}>
                  Strike Price
                </Typography>
                <Typography color="primary" mt={2}>
                  62800.00
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontSize={12} color={'#16161690'}>
                  Delivery Date
                </Typography>
                <Typography color="primary" mt={2}>
                  Sep 21, 2021
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontSize={12} color={'#16161690'}>
                  Invest Amount
                </Typography>
                <Typography color="primary" mt={2}>
                  1.290801 BTC
                </Typography>
              </Grid>
            </Grid>
          </Card>
          <OutlinedCard width="100%">
            <Box display={'grid'} width="100%" justifyContent={'center'} gap={2} padding="24px">
              <ImageComponent src={antimatterLogoUrl} style={{ height: 18 }} />
              <Typography color="primary" mt={10}>
                Dual Investment
              </Typography>
              <Typography fontSize={12}>14 Oct 2021 11:51PM</Typography>
            </Box>
          </OutlinedCard>
        </Box>
      </Card>
    ),
    []
  )

  useEffect(() => {
    const canvas = document.getElementById('claimSuccessCanvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // const img = document.getElementById('claimSuccessImg') as HTMLImageElement
    const data = ReactDOMServer.renderToStaticMarkup(<SuccessModal />)
    const DOMURL = window.URL || window.webkitURL || window
    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // /* @ts-ignore */
    const img = new Image()
    const imgSrc = encodeURIComponent(data)
    const svg = new Blob([imgSrc], { type: 'image/svg+xml;charset=utf-8' })
    const url = DOMURL.createObjectURL(svg)

    img.onload = function() {
      console.log
      ctx.drawImage(img, 0, 0)
      DOMURL.revokeObjectURL(url)
    }

    img.src = url

    // const DOMURL = window.URL || window.webkitURL || window
    // const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    // const url = DOMURL.createObjectURL(svg)
    // console.log(data)
    // console.log(img.src)
    // img.src = url
  })

  return (
    <Modal customIsOpen={false} maxWidth="400px">
      {/* <img id="claimSuccessImg" src="" alt="" /> */}
      <canvas id="claimSuccessCanvas" width="200" height="200" />
      <Box>
        <SuccessModal />
      </Box>
      <Box width="100%" padding="0px 28px 32px">
        <Button height="40px" fontSize={14} width="max-content" style={{ padding: '12px 24px' }} onClick={handleClick}>
          Save Image
        </Button>
      </Box>
    </Modal>
  )
}
