import { useMemo } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import Button from 'components/Button/Button'
import Modal from 'components/Modal'
import { useParams } from 'react-router-dom'
import { useProduct } from 'hooks/useDualInvestData'
import Divider from 'components/Divider'
import dayjs from 'dayjs'
import QuestionHelper from 'components/essential/QuestionHelper'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function ConfirmModal({
  isOpen,
  onDismiss,
  onConfirm,
  amount
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  amount: string
}) {
  const { id } = useParams<{ id: string }>()
  const product = useProduct(id)
  const theme = useTheme()

  const data = useMemo(
    () => ({
      ['Platform service fee']: '1.5%',
      ['Spot Price']: product?.currentPrice ?? '-' + ' USDT',
      ['APY']: product?.apy ? (+product.apy * 100).toFixed(2) + '%' : '- %',
      ['Strike Price']: product?.strikePrice ?? '-' + ' USDT',
      ['Delivery Date']: product ? dayjs(product.expiredAt).format('DD MMM YYYY') : '-'
    }),
    [product]
  )

  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} padding="35px 32px 37px" closeIcon>
      <Box padding="0 21px">
        <Typography fontSize={20} fontWeight={500} textAlign="center">
          {product?.investCurrency} Financial Management
        </Typography>
        <Typography fontSize={20} fontWeight={500} color="#31B047" textAlign="center">
          [{product?.type === 'CALL' ? 'upward' : 'down'} exercise]
        </Typography>
        <Typography fontSize={18} fontWeight={500} sx={{ opacity: 0.4 }} mt={30} mb={16}>
          Subscription Amount
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={30}>
          {product && (
            <Typography fontSize={44} fontWeight={700}>
              {(
                +product.multiplier *
                +amount *
                (product ? (product.type === 'CALL' ? 1 : +product.strikePrice) : 1)
              ).toFixed(2)}
            </Typography>
          )}
          <Typography fontSize={24}>{product?.investCurrency}</Typography>
        </Box>
        <Divider sx={{ opacity: 0.1 }} />
        <Box display="grid" gap="8px" mt={29} mb={29}>
          {Object.keys(data).map((key, idx) => {
            return (
              <Box key={idx} display="flex" justifyContent="space-between">
                {key === 'Platform service fee' ? (
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ opacity: 0.8 }} component="span">
                      {key}
                    </Typography>
                    <span>
                      <QuestionHelper text="The platform will charge 2.0% of the profit as a service fee" size={11} />
                    </span>
                  </Box>
                ) : (
                  <Typography sx={{ opacity: 0.8 }}>{key}</Typography>
                )}
                <Typography color={key === 'APY' ? '#31B047' : theme.palette.text.primary}>
                  {data[key as keyof typeof data]}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Button onClick={onConfirm}>Confirm</Button>
      <Box>
        <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12 }} />
        <Typography component="span" fontSize={12}>
          Once subscribed, the subscribed products cannot be cancelled.
        </Typography>
      </Box>
    </Modal>
  )
}
