export const routes = {
  account: '/account',
  accountTab: '/account/:tab',
  chainOption: '/chain_option',
  chainOptionTyped: '/chain_option/:type',
  chainOptionMgmt: '/chain_option_mgmt/:id',
  dualInvest: '/dual_invest',
  dualInvestMgmt: '/dual_invest_mgmt/:id',
  dualInvestMgmtImg: '/dual_invest_mgmt/:id/:orderId',
  home: '/home',
  noService: 'no_service',
  recurringVault: '/recurring_vault',
  recurringVaultMgmt: '/recurring_vault_mgmt/:currency/:type',
  referral: '/:referrer'
}

export const SHARE_URL = window.location.origin.toString() + '/#/dual_invest_mgmt/:id/:orderId'
