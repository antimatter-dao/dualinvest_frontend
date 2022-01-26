import { Typography, Box, Checkbox, FormControlLabel } from '@mui/material'

export default function Filter({
  options,
  checkedOption,
  onChange
}: {
  options: string[]
  checkedOption: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Box display="flex" alignItems="center" gap={23}>
      <Typography fontSize={18}>Filter</Typography>
      {options.map(option => (
        <FormControlLabel
          key={option}
          control={<Checkbox checked={option === checkedOption} onChange={onChange} id={option} />}
          label={option}
        />
      ))}
    </Box>
  )
}
