import { Box, Typography, Collapse } from '@mui/material'
import AccordionButton from 'components/Button/AccordionButton'
import { useState } from 'react'
import Card from 'components/Card/Card'
import Divider from 'components/Divider'

export default function PositionTableCards({
  data,
  header,
  moreHeader,
  headerIdx
}: {
  data: { summaryList: any[][]; hiddenList: any[][] }
  header: string[]
  moreHeader: string[]
  headerIdx: any
}) {
  const [expanded, setExpanded] = useState<null | number>(null)

  return (
    <Box display="flex" flexDirection="column" gap={8} mt={24} mb={24}>
      {data.summaryList.map((dataRow, idx) => (
        <Card key={idx} color="#F2F5FA" padding="17px 16px">
          <Box display="flex" flexDirection="column" gap={16}>
            {dataRow.map((datum, idx2) => {
              if (idx2 === headerIdx.status) {
                return (
                  <Box display="flex" alignItems="center" gap={14} key={idx2}>
                    {datum}
                    <AccordionButton
                      onClick={() => {
                        expanded === idx ? setExpanded(null) : setExpanded(idx)
                      }}
                      expanded={expanded === idx}
                    />
                  </Box>
                )
              }

              return (
                <Box key={idx2} display="flex" justifyContent="space-between">
                  <Typography component="div" fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                    {header[idx2]}
                  </Typography>
                  <Typography fontSize={12} fontWeight={600} component="div">
                    {datum}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          <Collapse in={expanded === idx && !!data.hiddenList[idx]}>
            <Divider extension={16} color="1px solid #252525" />
            <Box display="flex" flexDirection="column" gap={16} mt={20}>
              {data.hiddenList[idx].map((datum, idx) => {
                return (
                  <Box key={idx} display="flex" justifyContent="space-between">
                    <Typography fontSize={12} color="#000000" sx={{ opacity: 0.5 }}>
                      {moreHeader[idx]}
                    </Typography>
                    <Typography fontSize={12} fontWeight={600}>
                      {datum}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Collapse>
        </Card>
      ))}
    </Box>
  )
}
