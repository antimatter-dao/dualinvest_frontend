import { Select as MuiSelect, InputLabel as MuiInputLabel, styled, InputBase, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
interface Props {
  children?: React.ReactNode
  onChange?: (e: any) => void
  defaultValue?: any
  value?: string | string[]
  disabled?: boolean
  selected?: React.ReactNode
  placeholder?: string
  width?: string | number
  height?: string | number
  multiple?: boolean
  primary?: boolean
  label?: string
  renderValue?: any
}

const StyledInputLabel = styled(MuiInputLabel)(({ theme }) => ({
  opacity: 0.6,
  fontSize: 12,
  color: theme.palette.text.secondary,
  marginBottom: '8px'
}))

const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: '10px',
  border: '1px solid transparent',
  position: 'relative',
  padding: '10px',
  '& .MuiSelect-icon': {
    color: theme.palette.primary.contrastText,
    right: '10px'
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main
  }
}))

export default function Select(props: Props) {
  const {
    disabled,
    onChange,
    children,
    width,
    height,
    label,
    primary,
    value,
    defaultValue,
    placeholder,
    renderValue
  } = props
  const theme = useTheme()

  return (
    <div>
      {label && <StyledInputLabel>{label}</StyledInputLabel>}
      <StyledSelect
        sx={{
          backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.default,
          width: width || '100%',
          height: height || '60px',
          '&:before': {
            content: value || defaultValue ? "''" : `"${placeholder}"`,
            position: 'absolute',
            left: 24,
            top: 10,
            zIndex: 999,
            fontSize: 16,
            fontWeight: 400
          },
          '&:hover': {
            backgroundColor: disabled ? theme.palette.background.paper : theme.palette.primary.main
          },
          '& .MuiSelect-icon': {
            display: disabled ? 'none' : 'block',
            color: theme.palette.text.secondary
          }
        }}
        value={value}
        displayEmpty
        disabled={disabled}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              width: width ?? '100%',
              borderRadius: '10px',
              mt: '20px',
              boxShadow: theme => theme.shadows[4],
              transform: width ? 'translateX(-12px)!important' : 'none',
              '& li': {
                fontSize: 16,
                fontWeight: 500,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                '&.Mui-selected': {
                  backgroundColor: 'transparent'
                }
              },
              '& li:hover': {
                backgroundColor: theme => theme.palette.primary.light
              },
              '& li:last-child': {
                borderBottom: 'none'
              },
              '& .MuiMenuItem-root': {
                display: 'flex',
                justifyContent: 'space-between',
                padding: 16,
                '&::after': {
                  content: '""',
                  width: 30,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center'
                },
                '&.Mui-selected::after': {
                  content: `url(${SelectedIcon})`,
                  width: 30,
                  height: 20,
                  display: 'flex',
                  justifyContent: 'center'
                }
              }
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
        input={<InputBase />}
        IconComponent={ExpandMoreIcon}
        onChange={onChange}
        renderValue={renderValue || ''}
      >
        {children}
      </StyledSelect>
    </div>
  )
}
