import { styled } from '@mui/material'
import { Dots } from 'theme/components'

const Frame = styled('div')(`
width: calc(100% - 40px);
max-width: 500px;
margin: 20px;
height: 280px;
border: 1px solid rgba(255, 255, 255, 0.2);
box-sizing: border-box;
border-radius: 32px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: #ffffff;
`)

const Title = styled('p')(`
  font-weight: 500;
  font-size: 24px;
  line-height: 88.69%;
`)

export default function ComingSoon() {
  return (
    <Frame>
      <Title>
        Coming Soon <Dots />
      </Title>
      <div>This section is still implemeting.</div>
      <div>Please come back later</div>
    </Frame>
  )
}
