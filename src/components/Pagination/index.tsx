import { styled, Pagination as MuiPagination, Pagination } from '@mui/material'
import { ThemeProvider as MaterialThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import { theme } from 'theme/index'

const materialTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  textColor: theme.textColor,
  bgColor: theme.bgColor,
  gradient: theme.gradient,
  height: theme.height,
  width: theme.width
})

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  margin: 'auto',
  color: theme.textColor.text1,
  '.MuiPaginationItem-page.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.textColor.text4,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

const StyledPaginationLayout = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  '& > *': {
    marginBottom: '20px'
  }
})

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
