import React, { useCallback } from 'react'
import { Tabs as MuiTabs, Tab, Box } from '@mui/material'

interface Props {
  titles: string[] | JSX.Element[]
  contents: React.ReactNode[]
}

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <div hidden={value !== index}>{value === index && children}</div>
}

export default function Tabs(props: Props) {
  const { titles, contents } = props
  const [value, setValue] = React.useState(0)

  const onChange = useCallback((e: React.ChangeEvent<any>, value: any) => {
    setValue(value)
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs value={value} onChange={onChange} sx={{ mb: -1 }}>
          {titles.map((tab, idx) => (
            <Tab
              disableRipple
              key={idx}
              label={tab}
              sx={{
                padding: '20px 10px 25px 0',
                mr: 25,
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
        <TabPanel value={value} index={idx} key={idx}>
          {content}
        </TabPanel>
      ))}
    </Box>
  )
}
