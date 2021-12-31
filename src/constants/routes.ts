export const routes = {
  home: '/home',
  chainOption: '/chain_option',
  dualInvest: '/dual_invest',
  dualInvestMgmt: '/dual_invest_mgmt/:id',
  dualInvestMgmtImg: '/dual_invest_mgmt/:id/:orderId',
  account: '/account/:tab',
  noService: 'no_service',
  referral: '/:referrer'
}

export const SHARE_URL = window.location.origin.toString() + '/#/dual_invest_mgmt/:id/:orderId'
