import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Input from 'components/Input'
import Modal from 'components/Modal'
import Button from 'components/Button/Button'
import { routes } from 'constants/routes'
import useModal from 'hooks/useModal'
import SecondaryButton from 'components/Button/SecondaryButton'
import Divider from 'components/Divider'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { useActiveWeb3React } from 'hooks'

export default function ReferalModal({ showRedirectButton = true }: { showRedirectButton?: boolean }) {
  const { account } = useActiveWeb3React()
  const [link] = useState(window.location.origin.toString() + '/#/' + account)
  const [, setCopied] = useCopyClipboard()
  const history = useHistory()
  const { hideModal } = useModal()

  const handleRedirect = useCallback(() => {
    history.push(routes.account.replace(':tab', 'referral'))
    hideModal()
  }, [hideModal, history])

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      setCopied(link)
      if (e.target) {
        const target = e.target as HTMLButtonElement
        target.innerHTML = 'Copied'
        setTimeout(() => {
          target.innerHTML = 'Copy'
        }, 900)
      }
    },
    [link, setCopied]
  )

  return (
    <Modal closeIcon>
      <Box display="grid" padding="40px" gap="22px">
        <Typography align="center" fontSize={20} fontWeight={500}>
          Referral
        </Typography>
        <Box display="grid" gap={18}>
          <Typography fontSize={18} fontWeight={500} color="#00000060">
            My referral link
          </Typography>
          <Input
            disabled
            value=""
            placeholder={link}
            endAdornment={
              <SecondaryButton
                onClick={handleCopy}
                primary
                style={{
                  marginLeft: 10,
                  width: '60px',
                  height: '32px'
                }}
              >
                Copy
              </SecondaryButton>
            }
          />
        </Box>
        {showRedirectButton && (
          <Box ml="auto">
            <Button onClick={handleRedirect} width="172px" height="36px" fontSize={'14px'} style={{ borderRadius: 5 }}>
              My Referral reward ➡️
            </Button>
          </Box>
        )}
        <Divider color="rgba(0, 0, 0, 0.1)" />
        <Box display="flex" gap={8}>
          <InfoOutlinedIcon
            sx={{ color: theme => theme.palette.primary.main, height: 12, width: 12 }}
            display="inline"
          />
          <Typography fontSize={12} sx={{ color: theme => theme.palette.text.secondary }} component="span">
            A new user who enters the platform through your referral link can form a binding relationship with you, and
            you will receive a reward of 0.5% of the user’s future investment income
            <br />
            <br />
            You can invite countless new accounts to increase your revenue, but each new user can only have one referral
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
