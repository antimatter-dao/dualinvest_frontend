import { Box } from '@mui/material'
import Card from 'components/Card/Card'
import ProductCardHeader from 'components/ProductCardHeader'

interface Props {
  logoCurSymbol: string
  curPrice?: string
  title: string
  priceCurSymbol: string
  description: string
}

export default function VaultCard(props: Props) {
  const { logoCurSymbol, curPrice, title, priceCurSymbol, description } = props

  return (
    <Card>
      <Box padding="34px 29px 39px">
        <ProductCardHeader
          logoCurSymbol={logoCurSymbol}
          curPrice={curPrice}
          title={title}
          description={description}
          priceCurSymbol={priceCurSymbol}
        />
      </Box>
    </Card>
  )
}
