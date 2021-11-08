import { Select as MuiSelect, styled } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import TextButon from 'components/Button/TextButton'
// import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'

interface Props {
  children?: React.ReactNode
  onChange?: (e: any) => void
  defaultValue?: any
  value?: string | string[]
  disabled?: boolean
  selected?: React.ReactNode
  placeholder: string
  width?: string | number
  height?: string | number
  multiple?: boolean
  primary?: boolean
}

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  backgroundColor: theme.palette.grey.A400,
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  '& .MuiSelect-icon': {
    color: '#FFFFFF'
  }
}))

export default function Select(props: Props) {
  const { disabled, onChange, children, placeholder, width, height } = props

  return (
    <StyledSelect
      sx={{
        padding: '10px',
        width: width || '100%',
        height: height || '48px'
      }}
      displayEmpty
      disabled={disabled}
      MenuProps={{
        PaperProps: {
          style: {
            marginTop: '5px'
          }
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left'
        }
      }}
      IconComponent={ExpandMoreIcon}
      onChange={onChange}
      renderValue={(selected: any) => {
        return selected ?? <>{placeholder}</>
      }}
    >
      {children}
    </StyledSelect>
  )
}
