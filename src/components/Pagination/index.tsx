import { styled, Pagination, Typography, Box } from '@mui/material'

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '& .MuiPaginationItem-root': { opacity: 0.5 },
  '& .MuiPaginationItem-page.Mui-selected': {
    backgroundColor: 'transparent',
    opacity: 1,
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary
  }
}))

interface PaginationProps {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
  // setPage: (page: number) => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: (event: object, page: number) => void
  perPage?: number
  total?: number
}
export default function PaginationView({
  count,
  page,
  onChange,
  // setPage,
  siblingCount,
  boundaryCount,
  perPage,
  total
}: PaginationProps) {
  return (
    <>
      {count > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: { xs: 20, sm: 26 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          {perPage && (
            <Box
              sx={{
                width: { xs: '100%', sm: 'fit-content' }
              }}
            >
              <Typography
                sx={{
                  opacity: 0.4
                }}
              >
                {(page - 1) * perPage + 1} - {total && page * perPage > total ? total : page * perPage} items of {total}
              </Typography>
            </Box>
          )}
          <StyledPagination
            count={count}
            page={page}
            siblingCount={siblingCount || 1}
            boundaryCount={boundaryCount || 1}
            variant="outlined"
            shape="rounded"
            onChange={onChange}
          />
        </Box>
      )}
    </>
  )
}
