import { useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import CryptoJs from 'crypto-js'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import MuiCloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import CopyIcon from '@mui/icons-material/ContentCopy'
import Card, { OutlinedCard } from 'components/Card/Card'
import Modal from 'components/Modal'
import html2canvas from 'html2canvas'
import clapUrl from 'assets/images/clap.png'
import antimatterLogoUrl from 'assets/images/antimatter.png'
import ImageComponent from 'components/Image'
import Divider from 'components/Divider'
import Button from 'components/Button/Button'
import useBreakpoint from 'hooks/useBreakpoint'
import Spinner from 'components/Spinner'
import { SHARE_URL } from 'constants/routes'

export const isSafari = () =>
  navigator.vendor.match(/apple/i) &&
  !navigator.userAgent.match(/crios/i) &&
  !navigator.userAgent.match(/fxios/i) &&
  !navigator.userAgent.match(/Opera|OPT\//)

export default function ClaimSuccessModal({
  apy,
  strikePrice,
  type,
  currency,
  deliveryDate,
  investAmount,
  earn,
  returnedCurrency,
  productId,
  exercised,
  orderId,
  showShare = true
}: {
  apy: string
  strikePrice: string
  type: string
  currency: string
  deliveryDate: string
  investAmount: string
  earn: string
  returnedCurrency: string
  productId: string
  exercised: boolean
  orderId: string
  showShare?: boolean
}) {
  const [img, setImg] = useState<string | undefined>(undefined)
  const [imgSize, setImgSize] = useState({ w: '400px', h: '458px' })
  const [isCopied, setIsCopied] = useState(false)
  const [copyItem, setCopyItem] = useState<Blob | undefined>(undefined)
  const [imgIsOpen, setImgIsOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)
  const isDownSm = useBreakpoint()

  const handleClick = useCallback(() => {
    const el = document.getElementById('claimSuccessModalEl') as HTMLDivElement
    if (!el) return

    html2canvas(el).then(canvas => {
      setPending(true)
      setImgSize({ w: canvas.style.width, h: canvas.style.height })
      setImg(canvas.toDataURL())

      canvas.toBlob(async (blob: Blob | null) => {
        if (blob === null) return
        setPending(false)
        setCopyItem(blob)

        const blobPromise = async function() {
          return await new Promise(resolve => {
            resolve(blob)
            return blob
          })
        }

        try {
          if (isSafari()) {
            await navigator.clipboard.write([
              new ClipboardItem({
                ['image/png']: blobPromise() as any
              })
            ])
          } else {
            await navigator.clipboard.write([
              new ClipboardItem({
                ['image/png']: blob as any
              })
            ])
          }
          setIsCopied(true)
          setSuccess(true)
          setTimeout(() => {
            setIsCopied(false)
            // setImgIsOpen(false)
          }, 1100)
        } catch (err) {
          console.error(err)
          setSuccess(false)
        }

        // })

        // navigator.clipboard.write([
        //   new ClipboardItem({
        //     'image/png': blobPromise
        //   })
        // ])

        setImgIsOpen(true)
        // navigator.clipboard.write([new ClipboardItem({ 'image/png': blob as any })])
      })
    })
  }, [])

  const handleCopy = useCallback(() => {
    if (!copyItem) return
    navigator.clipboard.write([new ClipboardItem({ 'image/png': copyItem as any })])
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }, [copyItem])

  return (
    <>
      <Modal
        customIsOpen={imgIsOpen}
        maxWidth="400px"
        customOnDismiss={() => setImgIsOpen(false)}
        background="transparent"
        backdropColor="#00000095"
        hasBorder={false}
        isCardOnMobile
      >
        <ButtonBase
          component="div"
          sx={{
            display: 'grid',
            '& img': {
              transform: isDownSm ? 'scale(70%)' : 'scale(80%)',
              borderRadius: 2
            }
          }}
        >
          {img && <ImageComponent src={img} style={{ height: imgSize.h, width: imgSize.w, display: 'block' }} />}
          {success ? (
            <Typography color="#ffffff" fontSize={26} align="center">
              Copied to clipboard
              <IconButton onClick={handleCopy}>
                {isCopied ? <CheckIcon sx={{ color: '#ffffff' }} /> : <CopyIcon sx={{ color: '#ffffff' }} />}
              </IconButton>
            </Typography>
          ) : (
            <>
              <Typography color="#ffffff" fontSize={26} align="center">
                {isMobile ? 'Long press image to' : 'Right click image to'} save image
              </Typography>
            </>
          )}
        </ButtonBase>
        {!success && (
          <Typography color="#ffffff" fontSize={26} align="center" component="div">
            <IconButton
              sx={{ border: '1px solid #ffffff' }}
              onClick={() => {
                setImgIsOpen(false)
              }}
            >
              <MuiCloseIcon sx={{ color: '#ffffff' }} />
            </IconButton>
          </Typography>
        )}
      </Modal>
      <Modal maxWidth="400px" closeIcon>
        <Box id="claimSuccessModalEl" maxWidth="400px">
          <Card width="100%">
            <Box padding="32px 28px" display="grid" justifyItems={'center'} width="100%" gap={12}>
              <Typography color="primary" fontSize={24}>
                The benefits are great !
              </Typography>
              <ImageComponent src={clapUrl} style={{ width: 80, height: 80, objectFit: 'cover', margin: '24px' }} />
              <Box display="flex" gap="20px">
                <Typography>
                  APY:{' '}
                  <Typography component="span" color="primary" variant="inherit">
                    {apy}
                  </Typography>
                </Typography>
                <Divider orientation="vertical" color="#00000024" />
                <Typography>
                  {currency}-{type === 'CALL' ? 'Upward' : 'Down'}
                </Typography>
                <Divider orientation="vertical" color="#00000024" />
                <Typography color="primary">{exercised ? 'Exercised' : 'Unexercised'}</Typography>
              </Box>
              <Typography color="primary" fontWeight={600} fontSize={30}>
                +{earn} {returnedCurrency}
              </Typography>
              <Card gray width="100%">
                <Box display="flex" justifyContent="space-between" width="100%" padding="14px 20px">
                  <Box>
                    <Typography fontSize={12} color={'#16161690'}>
                      Strike Price
                    </Typography>
                    <Typography color="primary" mt={2}>
                      {strikePrice}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={12} color={'#16161690'}>
                      Delivery Date
                    </Typography>
                    <Typography color="primary" mt={2}>
                      {deliveryDate}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography fontSize={12} color={'#16161690'}>
                      Invest Amount
                    </Typography>
                    <Typography color="primary" mt={2}>
                      {investAmount}
                    </Typography>
                  </Box>
                </Box>
              </Card>
              <OutlinedCard width="100%">
                <Box display={'grid'} width="100%" justifyContent={'center'} gap={2} padding="24px">
                  <ImageComponent src={antimatterLogoUrl} style={{ height: 18 }} />
                  <Typography color="primary" mt={10}>
                    Dual Investment
                  </Typography>
                  {/* <Typography fontSize={12}>14 Oct 2021 11:51PM</Typography> */}
                </Box>
              </OutlinedCard>
            </Box>
          </Card>
        </Box>

        {showShare && (
          <Box
            width="100%"
            maxWidth="100%"
            padding="0px 28px 32px"
            display="flex"
            justifyContent={'space-between'}
            gap="8px"
            flexWrap={'wrap'}
          >
            <Button
              height="40px"
              fontSize={14}
              width="max-content"
              style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}
              onClick={handleClick}
            >
              {pending ? <Spinner marginLeft={'10px'} color="#ffffff" /> : ' Save Image'}
            </Button>
            <Box display="flex" gap="8px">
              <FacebookShareButton
                url={SHARE_URL.replace(':id', productId).replace(
                  ':orderId',
                  CryptoJs.AES.encrypt(orderId, 'Antimatter dual')
                    .toString()
                    .replaceAll('/', '+')
                )}
                quote={`Antimattter Dual Investment | The benefits are great ! +${earn} ${returnedCurrency}, APY:${apy}`}
                style={{ backgroundColor: '#161616', borderRadius: 10 }}
              >
                <Box display="flex" alignItems="center" height={40} padding="0 15px 0 5px">
                  <FacebookIcon size={25} round={true} bgStyle={{ fill: 'transparent' }} />
                  <Typography color="#ffffff"> Share</Typography>
                </Box>
              </FacebookShareButton>
              <TwitterShareButton
                url={SHARE_URL.replace(':id', productId).replace(
                  ':orderId',
                  CryptoJs.AES.encrypt(orderId, 'Antimatter dual')
                    .toString()
                    .replaceAll('/', '+')
                )}
                title={`Antimattter Dual Investment | The benefits are great ! +${earn} ${returnedCurrency}, APY:${apy}`}
                style={{ backgroundColor: '#161616', borderRadius: 10 }}
              >
                <Box display="flex" alignItems="center" height={40} padding="0 15px 0 5px">
                  <TwitterIcon size={25} round={true} bgStyle={{ fill: 'transparent' }} />
                  <Typography color="#ffffff"> Share</Typography>
                </Box>
              </TwitterShareButton>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  )
}
