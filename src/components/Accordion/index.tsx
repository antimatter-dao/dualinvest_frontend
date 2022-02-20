import { SyntheticEvent } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
interface Props {
  summary: string | JSX.Element
  details: string | JSX.Element
  expanded: boolean
  onChange: (event: SyntheticEvent, isExpanded: boolean) => void
}

export default function _Accordion(props: Props) {
  const { summary, details, expanded, onChange } = props

  return (
    <Accordion
      onChange={onChange}
      sx={{
        boxShadow: 'none',
        '& .MuiAccordionSummary-content': {
          margin: '20px 0'
        },
        '&.Mui-expanded:before': {
          opacity: 1
        }
      }}
      expanded={expanded}
    >
      <AccordionSummary
        sx={{ fontSize: { xs: 14, md: 16 } }}
        expandIcon={expanded ? <RemoveIcon sx={{ color: '#929292' }} /> : <AddIcon sx={{ color: '#929292' }} />}
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails>{details}</AccordionDetails>
    </Accordion>
  )
}
