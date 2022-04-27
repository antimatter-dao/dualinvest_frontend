import { useCallback, useEffect, useMemo, useState } from 'react'
import { Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useBSCDualInvestContract, useDualInvestContract } from './useContract'
import { parseBalance } from 'utils/parseAmount'
import { trimNumberString } from 'utils/trimNumberString'

export function useRecurBalance(
  currency: Token | undefined,
  investCucrrency: Token | undefined
): { autoBalance: string; autoLockedBalance: string; autoBalanceRaw: string } {
  const [autoBalanceRaw, setAutoBalanceRaw] = useState('0')
  const [autoBalance, setAutoBalance] = useState('-')
  const [autoLockedBalance, setAutoLockedBalance] = useState('-')
  const contract = useBSCDualInvestContract()
  const { account } = useActiveWeb3React()

  const args = useMemo(() => [currency?.address ?? '', investCucrrency?.address ?? '', account ?? undefined], [
    currency?.address,
    investCucrrency?.address,
    account
  ])

  useEffect(() => {
    if (!contract || !investCucrrency) return
    contract
      .autoBalances(...args)
      .then((r: any) => {
        setAutoBalanceRaw(r.toString())
        setAutoBalance(r ? trimNumberString(parseBalance(r.toString(), investCucrrency, 18), 6) : '-')
      })
      .catch((e: any) => {
        console.error(e)
      })
    contract
      .autoBalances_lock(...args)
      .then((r: any) => {
        setAutoLockedBalance(r ? trimNumberString(parseBalance(r.toString(), investCucrrency, 18), 6) : '-')
      })
      .catch((e: any) => {
        console.error(e)
      })
  }, [args, contract, currency, investCucrrency])

  return useMemo(() => {
    return {
      autoBalanceRaw,
      autoBalance,
      autoLockedBalance
    }
  }, [autoBalance, autoBalanceRaw, autoLockedBalance])
}

export function useRecurCallback(): {
  investCallback: undefined | ((val: string, curAddress: string, investCurAddress: string) => Promise<any>)
  redeemCallback: undefined | ((val: string, curAddress: string, investCurAddress: string) => Promise<any>)
} {
  const contract = useDualInvestContract()

  const invest = useCallback(
    async (val, curAddress, investCurAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas
        .autoDeposit(curAddress, val, investCurAddress)
        .catch((error: Error) => {
          console.debug('Failed to invest', error)
          throw error
        })
      return contract?.autoDeposit(curAddress, val, investCurAddress, { gasLimit: estimatedGas })
    },
    [contract]
  )

  const redeem = useCallback(
    async (val, curAddress, investCurAddress): Promise<any> => {
      if (!contract) {
        throw Error('no contract')
      }
      const estimatedGas = await contract.estimateGas
        .autoWithdraw(curAddress, val, investCurAddress)
        .catch((error: Error) => {
          console.debug('Failed to redeem', error)
          throw error
        })
      return contract?.autoWithdraw(curAddress, val, investCurAddress, { gasLimit: estimatedGas })
    },
    [contract]
  )

  return useMemo(() => {
    return {
      investCallback: invest,
      redeemCallback: redeem
    }
  }, [redeem, invest])
}
