import React, { useCallback } from 'react'
import { Tabs as MuiTabs, Tab, Box, TabProps } from '@mui/material'

interface Props {
  titles: string[] | JSX.Element[]
  contents: React.ReactNode[]
  customCurrentTab?: number
  customOnChange?: (val: number) => void
  tabPadding?: string
  CustomTab?: React.FC<TabProps>
  fontWeight?: number
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <div hidden={value !== index}>{value === index && children}</div>
}

export default function Tabs(props: Props) {
  const { titles, contents, customCurrentTab, customOnChange, tabPadding, CustomTab, fontWeight } = props
  const [value, setValue] = React.useState(0)

  const onChange = useCallback(
    (e: React.ChangeEvent<any>, value: any) => {
      customOnChange ? customOnChange(value) : setValue(value)
    },
    [customOnChange]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={CustomTab ? undefined : { borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs
          allowScrollButtonsMobile
          scrollButtons="auto"
          value={customCurrentTab !== undefined ? customCurrentTab : value}
          onChange={onChange}
          sx={{ mb: -1 }}
          TabIndicatorProps={CustomTab ? { style: { display: 'none' } } : undefined}
        >
          {CustomTab
            ? titles.map((tab, idx) => <CustomTab key={idx} label={tab} />)
            : titles.map((tab, idx) => (
                <Tab
                  disableRipple
                  key={idx}
                  label={tab}
                  sx={{
                    fontWeight: fontWeight ?? 400,
                    padding: { xs: '20px 0px 17px 0px', md: tabPadding ?? '20px 10px 25px 0px' },
                    mr: { xs: 23, md: 25 },
                    textTransform: 'none',
                    minWidth: '45px',
                    color: theme => theme.palette.text.primary,
                    opacity: 0.4,
                    '&.Mui-selected': {
                      color: theme => theme.palette.text.primary,
                      opacity: 1
                    }
                  }}
                />
              ))}
        </MuiTabs>
      </Box>
      {contents.map((content, idx) => (
        <TabPanel value={customCurrentTab !== undefined ? customCurrentTab : value} index={idx} key={idx}>
          {content}
        </TabPanel>
      ))}
    </Box>
  )
}
