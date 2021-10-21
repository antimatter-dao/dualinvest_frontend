import { Checkbox, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ReactComponent as CheckboxIcon } from '../../assets/componentsIcon/checkbox.svg'
import { ReactComponent as CheckboxCheckedIcon } from '../../assets/componentsIcon/checkbox_checked.svg'

interface Props {
  checked: boolean
  onChange?: () => void
  label?: string
  disabled?: boolean
}

const useStyles = makeStyles({
  root: {
    margin: 0
  },
  checkbox: {
    padding: 0,
    marginRight: 12
  },
  label: {
    fontSize: 16,
    fontWeight: 400
  }
})

export default function _Checkbox(props: Props) {
  const classes = useStyles(props)
  const { checked, onChange, label, disabled } = props
  return (
    <FormControlLabel
      classes={{ root: classes.root, label: classes.label }}
      control={<Checkbox className={classes.checkbox} icon={<CheckboxIcon />} checkedIcon={<CheckboxCheckedIcon />} />}
      label={label}
      labelPlacement="end"
      onChange={onChange}
      checked={checked}
      disabled={disabled}
    />
  )
}
