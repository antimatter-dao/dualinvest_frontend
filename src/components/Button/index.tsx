import styled from 'styled-components'
import { Button as RebassButton } from 'rebass/styled-components'

export const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '14px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 49px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.bg1};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
  }
  &:hover {
    background-color: ${({ theme }) => theme.primary4};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
  }
  &:disabled {
    cursor: auto;
    box-shadow: none;
    background: ${({ theme }) => theme.primary5};
    border: 1px solid
      ${({ theme, altDisabledStyle, disabled }) =>
        altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.primary5};
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
  }
`

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.text5};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
    border: 1px solid ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg2};
  }
`

export const ButtonOutlinedPrimary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary1};
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};

  :hover,
  :focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary4};
    border-color: ${({ theme }) => theme.primary4};
    color: ${({ theme }) => theme.primary4};
  }
  :active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }

  &:disabled {
    border-color: ${({ theme }) => theme.primary5};
    color: ${({ theme }) => theme.primary5};
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)<{ color?: string }>`
  background-color: transparent;
  color: ${({ theme, color }) => color ?? theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`
