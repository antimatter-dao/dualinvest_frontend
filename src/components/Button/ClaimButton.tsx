import Button from 'components/Button/Button'

export default function ClaimButton({
  width,
  onClick,
  disabled
}: {
  width?: number
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
}) {
  return (
    <Button
      disableRipple={true}
      disabled={disabled}
      onClick={onClick}
      fontSize={14}
      style={{ width: width || 60, borderRadius: 4, height: 36 }}
    >
      Claim
    </Button>
  )
}
