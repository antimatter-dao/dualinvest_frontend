import { InputHTMLAttributes, useCallback } from 'react'
import Input, { InputProps } from './index'
import { escapeRegExp } from 'utils'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export default function NumericalInput({
  placeholder,
  onChange,
  ...props
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  const enforcer = (nextUserInput: string) => {
    const fixed = nextUserInput.replace(/,/g, '.')
    if (fixed === '' || inputRegex.test(escapeRegExp(fixed))) {
      return fixed
    }
    return null
  }
  const handleChange = useCallback(
    event => {
      // replace commas with periods
      const formatted = enforcer(event.target.value)
      if (formatted === null) {
        return
      }
      event.target.value = formatted
      onChange && onChange(event)
    },
    [onChange]
  )

  return (
    <Input
      {...props} // universal input options
      onChange={handleChange}
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  )
}
