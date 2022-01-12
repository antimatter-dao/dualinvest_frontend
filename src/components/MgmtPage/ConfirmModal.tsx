import { Box, Typography, useTheme } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Button from 'components/Button/Button'
import Modal from 'components/Modal'
import Divider from 'components/Divider'
import QuestionHelper from 'components/essential/QuestionHelper'
import { feeRate } from 'constants/index'
import { Currency } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import React from 'react'

export default function ConfirmModal({
  isOpen,
  onDismiss,
  onConfirm,
  amount,
  data,
  showCancelWarning,
  title,
  subTitle,
  investCurrency,
  children
}: {
  isOpen: boolean
  onDismiss: () => void
  onConfirm: () => void
  amount: string
  data: { [key: string]: any }
  title: string
  subTitle?: string
  investCurrency?: Currency
  showCancelWarning?: boolean
  children?: React.ReactNode
}) {
  const theme = useTheme()

  return (
    <Modal customIsOpen={isOpen} customOnDismiss={onDismiss} padding="35px 32px 37px" closeIcon>
      <Box padding="0 21px">
        <Typography fontSize={20} fontWeight={500} textAlign="center">
          {title}
        </Typography>
        {subTitle && (
          <Typography fontSize={20} fontWeight={500} color="#31B047" textAlign="center">
            {subTitle}
          </Typography>
        )}
        {children}
        <Typography fontSize={18} fontWeight={500} sx={{ opacity: 0.4 }} mt={30} mb={16}>
          Subscription Amount
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={30} alignItems={'center'}>
          <Typography fontSize={44} fontWeight={700}>
            {amount}
          </Typography>
          {investCurrency && (
            <Box display="flex" gap="5px">
              <CurrencyLogo currency={investCurrency} />
              <Typography fontSize={24}>{investCurrency?.symbol}</Typography>
            </Box>
          )}
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
                      <QuestionHelper
                        text={`The platform will charge ${feeRate} of the profit as a service fee`}
                        size={11}
                      />
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
      {showCancelWarning && (
        <Box>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, height: 12 }} />
          <Typography component="span" fontSize={12}>
            Once subscribed, the subscribed products cannot be cancelled.
          </Typography>
        </Box>
      )}
    </Modal>
  )
}
