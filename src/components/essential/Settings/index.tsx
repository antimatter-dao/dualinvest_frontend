import { useState } from 'react'
import { useTheme, Box, Typography } from '@material-ui/core'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ApplicationModal } from '../../../state/application/actions'
import { useModalOpen, useSettingsModalToggle } from '../../../state/application/hooks'
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly
} from '../../../state/user/hooks'
import Modal from 'components/Modal'
import QuestionHelper from 'components/essential/QuestionHelper'
import TransactionSettings from './TransactionSettings'
import { ReactComponent as SettingsIcon } from 'assets/componentsIcon/setting.svg'
import Button from 'components/Button/Button'
import TextButton from 'components/Button/TextButton'
import SwitchToggle from 'components/SwitchToggle'

const StyledMenuIcon = styled(SettingsIcon)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text2};
  }

  :hover {
    opacity: 0.7;
  }
`

const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const CustomizedAutoRow = styled.div`
  display: flex;
  align-items: center;
  & > div {
    width: 50%;
  }
`
export const SLIPPAGE_TYPE = { generation: 'generation', redeem: 'redeem' }

export default function Settings({ onlySlippage }: { onlySlippage?: boolean }) {
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useSettingsModalToggle()

  const theme = useTheme()
  const [userSlippage, useSlippageSetting] = useUserSlippageTolerance()

  const [ttl, setTtl] = useUserTransactionTTL()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <>
      <TextButton onClick={toggle}>
        <StyledMenuIcon />
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </TextButton>
      <Modal
        customIsOpen={showConfirmation}
        customOnDismiss={() => setShowConfirmation(false)}
        maxWidth="500px"
        closeIcon
      >
        <Box display="grid" gridGap="8px" padding="24px">
          <Box display="flex" alignItems="center" justifyContent="space-between" padding="0 24px">
            <Text fontWeight={500} fontSize={18}>
              Are you sure?
            </Text>
          </Box>
          <Box display="grid" gridGap="8px" style={{ padding: '0 1rem' }}>
            <Text fontWeight={500} fontSize={14}>
              Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result in
              bad rates and lost funds.
            </Text>
            <Text fontWeight={600} fontSize={14}>
              ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
            </Text>
            <Button
              style={{ marginTop: '1rem' }}
              onClick={() => {
                if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                  toggleExpertMode()
                  setShowConfirmation(false)
                }
              }}
            >
              Turn On Expert Mode
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal customIsOpen={open} customOnDismiss={toggle} closeIcon>
        <Box
          display="grid"
          gridGap="28px"
          padding="30px 30px 48px"
          justifyContent="center"
          style={{ background: theme.gradient.gradient1 }}
        >
          <Typography variant="h6">Transaction Settings</Typography>
          <TransactionSettings
            rawSlippage={userSlippage}
            setRawSlippage={useSlippageSetting}
            deadline={ttl}
            setDeadline={setTtl}
            onlySlippage={onlySlippage}
          />
          {!onlySlippage && (
            <>
              <Text fontWeight={400} fontSize={18} style={{ marginTop: '16px' }}>
                Interface Settings
              </Text>
              <CustomizedAutoRow>
                <Box display="grid">
                  <Box display="flex" alignItems="center" marginBottom="11px">
                    <Text fontWeight={400} fontSize={14} color={theme.textColor.text2}>
                      Toggle Expert Mode
                    </Text>
                    <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
                  </Box>
                  <SwitchToggle
                    checked={expertMode}
                    onChange={
                      expertMode
                        ? () => {
                            toggleExpertMode()
                            setShowConfirmation(false)
                          }
                        : () => {
                            toggle()
                            setShowConfirmation(true)
                          }
                    }
                  />
                </Box>
                <Box display="grid">
                  <Box display="flex" alignItems="center" marginBottom="11px">
                    <Text fontWeight={400} fontSize={14} color={theme.textColor.text2}>
                      Disable Multihops
                    </Text>
                    <QuestionHelper text="Restricts swaps to direct pairs only." />
                  </Box>
                  <SwitchToggle
                    checked={singleHopOnly}
                    onChange={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
                  />
                </Box>
              </CustomizedAutoRow>
            </>
          )}
        </Box>
      </Modal>
    </>
  )
}
