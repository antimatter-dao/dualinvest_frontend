import { styled, Pagination, Typography } from '@mui/material'

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  // margin: '0 0 0 auto',
  color: theme.palette.text.secondary,
  '& .MuiPaginationItem-root': { opacity: 0.5 },
  '& .MuiPaginationItem-page.Mui-selected': {
    backgroundColor: 'transparent',
    opacity: 1,
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary
  }
}))

const StyledPaginationLayout = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center'
  // '& > *': {
  //   marginBottom: '20px'
  // }
})

interface PaginationProps {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
  setPage: (page: number) => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: (event: object, page: number) => void
  perPage?: number
}
export default function PaginationView({
  count,
  page,
  onChange,
  setPage,
  siblingCount,
  boundaryCount,
  perPage
}: PaginationProps) {
  return (
    <>
      {count > 0 && (
        <StyledPaginationLayout>
          {perPage && (
            <Typography sx={{ opacity: 0.4 }} mr={26}>
              {(page - 1) * perPage + 1} - {page * perPage} items of {count}
            </Typography>
          )}
          <StyledPagination
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
    </>
  )
}
