import MuiPagination from '@mui/material/Pagination'
import styled from 'styled-components'
import Pagination from '@mui/material/Pagination'
import { ThemeProvider as MaterialThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import { theme } from 'theme/muiTheme'

const materialTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  textColor: theme.textColor,
  bgColor: theme.bgColor,
  gradient: theme.gradient,
  height: theme.height
})

export const StyledPagination = styled(Pagination)`
  margin: auto;
  color: ${({ theme }) => theme.text1};
  .MuiPaginationItem-page.Mui-selected {
    background-color: ${({ theme }) => theme.primary2};
    color: ${({ theme }) => theme.text4};
    &:hover {
      background-color: ${({ theme }) => theme.primary3};
    }
  }
`

const StyledPaginationLayout = styled.div`
  display: flex;
  justify-content: center;
  & > * {
    margin-bottom: 20px;
  }
`

interface PaginationProps {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
  setPage: (page: number) => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: (event: object, page: number) => void
}
export default function PaginationView({
  count,
  page,
  onChange,
  setPage,
  siblingCount,
  boundaryCount
}: PaginationProps) {
  return (
    <MaterialThemeProvider theme={materialTheme}>
      {count > 0 && (
        <StyledPaginationLayout>
          <MuiPagination
            count={count}
            page={page}
            siblingCount={siblingCount || 1}
            boundaryCount={boundaryCount || 1}
            variant="outlined"
            shape="rounded"
            onChange={(event, page) => {
              onChange && onChange(event, page)
              setPage(page)
            }}
          />
        </StyledPaginationLayout>
      )}
    </MaterialThemeProvider>
  )
}
