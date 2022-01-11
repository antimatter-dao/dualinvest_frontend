import { IconButton } from '@mui/material'
import { ReactComponent as AccordionArrowDownIcon } from 'assets/componentsIcon/accordion_arrow_down.svg'
import { ReactComponent as AccordionArrowUpIcon } from 'assets/componentsIcon/accordion_arrow_up.svg'

export default function AccordionButton({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: 'max-content',
        height: 'max-content'
      }}
    >
      {expanded ? <AccordionArrowUpIcon /> : <AccordionArrowDownIcon />}
    </IconButton>
  )
}
