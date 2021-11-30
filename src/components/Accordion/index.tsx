import { useState, useRef } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
interface Props {
  items: {
    summary: string
    details: string | JSX.Element
  }[]
}

export default function _Accordion(props: Props) {
  const { items } = props
  const [expanded, setExpanded] = useState<number | null>(null)
  const node = useRef<any>()
  useOnClickOutside(node, () => setExpanded(null))

  return (
    <div>
      {items.map((item, idx) => (
        <Accordion
          key={idx}
          expanded={expanded === idx}
          onChange={() => setExpanded(idx)}
          sx={{
            boxShadow: 'none',
            '& .MuiAccordionSummary-content': {
              margin: '20px 0'
            }
          }}
        >
          <AccordionSummary
            expandIcon={
              expanded === idx ? <RemoveIcon sx={{ color: '#929292' }} /> : <AddIcon sx={{ color: '#929292' }} />
            }
          >
            <Typography fontSize={16} sx={{ opacity: 0.8 }}>
              {item.summary}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{item.details}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
