import { Select as MuiSelect, InputLabel as MuiInputLabel, styled, InputBase, useTheme } from '@mui/material'
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
  label?: string
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    border: '1px solid transparent'
  }
}))

const StyledInputLabel = styled(MuiInputLabel)(({ theme }) => ({
  opacity: 0.6,
  color: theme.palette.primary.contrastText,
  marginBottom: '8px'
}))

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  // backgroundColor: theme.palette.grey.A400,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid transparent`,
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.primary.main
  },
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  }
}))

export default function Select(props: Props) {
  const { disabled, onChange, children, placeholder, width, height, label, primary } = props
  const theme = useTheme()

  return (
    <>
      {label && <StyledInputLabel>{label}</StyledInputLabel>}
      <StyledSelect
        sx={{
          backgroundColor: primary ? theme.palette.primary.main : theme.palette.grey.A400,
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
        input={<StyledInputBase />}
        IconComponent={ExpandMoreIcon}
        onChange={onChange}
        renderValue={(selected: any) => {
          return selected ?? <>{placeholder}</>
        }}
      >
        {children}
      </StyledSelect>
    </>
  )
}
