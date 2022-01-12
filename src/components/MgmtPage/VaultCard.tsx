import Card from 'components/Card/Card'
import ProductCardHeader from 'components/ProductCardHeader'

interface Props {
  logoCurSymbol: string
  curPrice?: string
  title: string
  priceCurSymbol: string
}

export default function VaultCard(props: Props) {
  const { logoCurSymbol, curPrice, title, priceCurSymbol } = props

  return (
    <Card>
      <ProductCardHeader
        logoCurSymbol={logoCurSymbol}
        curPrice={curPrice}
        title={title}
        priceCurSymbol={priceCurSymbol}
      />
    </Card>
  )
}
