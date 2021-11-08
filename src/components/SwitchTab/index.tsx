import { styled } from '@mui/material'

export const SwitchTabWrapper = styled('div')({
  borderBottom: '1px solid rgb(255,255,255, 0.1)',
  whiteSpace: 'nowrap'
})

export const Tab = styled('button')(({ selected }: { selected: boolean }) => ({
  border: 'none',
  background: 'none',
  padding: '14px 0',
  marginRight: '40px',
  fontSize: '16px',
  fontWeight: 700,
  color: selected ? 'rgba(255,255,255, 1)' : 'rgba(255,255,255, 0.4)',
  borderBottom: selected ? '3px solid rgba(255,255,255, 1)' : '3px solid transparent',
  transition: '0.3s',
  cursor: 'pointer',
  '&:hover': {
    color: '#fff'
  }
}))

// function SwitchTab({
//   currentTab,
//   onTabClick
// }: {
//   currentTab: UserInfoTabs
//   onTabClick: (tab: UserInfoTabs) => () => void
// }) {
//   return (
//     <SwitchTabWrapper>
//       {Object.keys(UserInfoTabRoute).map(tab => {
//         const tabName = UserInfoTabRoute[tab as keyof typeof UserInfoTabRoute]
//         return (
//           <Tab key={tab} onClick={onTabClick(tab as UserInfoTabs)} selected={currentTab === tab}>
//             {tabName}
//           </Tab>
//         )
//       })}
//     </SwitchTabWrapper>
//   )
// }
