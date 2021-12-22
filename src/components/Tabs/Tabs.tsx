import React, { useCallback } from 'react'
import { Tabs as MuiTabs, Tab, Box } from '@mui/material'

interface Props {
  titles: string[] | JSX.Element[]
  contents: React.ReactNode[]
  customCurrentTab?: number
  customOnChange?: (val: number) => void
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <div hidden={value !== index}>{value === index && children}</div>
}

export default function Tabs(props: Props) {
  const { titles, contents, customCurrentTab, customOnChange } = props
  const [value, setValue] = React.useState(0)

  const onChange = useCallback(
    (e: React.ChangeEvent<any>, value: any) => {
      customOnChange ? customOnChange(value) : setValue(value)
    },
    [customOnChange]
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs value={customCurrentTab !== undefined ? customCurrentTab : value} onChange={onChange} sx={{ mb: -1 }}>
          {titles.map((tab, idx) => (
            <Tab
              disableRipple
              key={idx}
              label={tab}
              sx={{
                padding: { xs: '20px 0px 17px 0px', md: '20px 10px 25px 0px' },
                mr: { xs: 23, md: 25 },
                textTransform: 'none',
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
