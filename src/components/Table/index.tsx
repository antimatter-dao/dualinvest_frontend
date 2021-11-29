import { TableContainer, TableHead, TableCell, TableRow, TableBody, Box, Typography, styled } from '@mui/material'
import useBreakpoint from '../../hooks/useBreakpoint'

const Profile = styled('div')(`
  display: flex;
  align-items: center;
`)

export const TableProfileImg = styled('div', {
  shouldForwardProp: () => true
})(({ url }: { url?: string }) => ({
  height: '24px',
  width: '24px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '8px',
  background: `#000000 ${url ? `url(${url})` : ''}`
}))

export function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <TableProfileImg url={url} />
      {name}
    </Profile>
  )
}

const StyledTableContainer = styled(TableContainer)({
  display: 'table',
  // backgroundColor: '#ffffff',
  borderRadius: '40px',
  '& .MuiTableCell-root': {
    fontSize: '16px',
    borderBottom: 'none',
    fontWeight: 400,
    padding: '14px 20px',
    '& svg': {
      marginRight: 8
    },
    '&:first-child': {
      paddingLeft: 50
    },
    '&:last-child': {
      paddingRight: 50
    }
  },
  '& table': {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px'
  }
})

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  borderRadius: 8,
  overflow: 'hidden',
  '& .MuiTableCell-root': {
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '12px 20px 12px 0',
    fontSize: '12px',
    color: theme.palette.text.secondary,
    borderBottom: 'none',
    '&:first-child': {
      paddingLeft: 30,
      borderTopLeftRadius: 8
    },
    '&:last-child': {
      paddingRight: 30,
      borderTopRightRadius: 8
    }
  }
}))

const StyledTableRow = styled(TableRow)({
  height: 80,
  backgroundColor: 'transparent',
  borderRadius: '16px',
  marginTop: '8px',
  overflow: 'hidden',
  position: 'relative',
  '& .MuiTableCell-root': {
    justifyContent: 'flex-start',
    border: '1px solid #00000010',
    borderRight: 'none',
    borderLeft: 'none',
    paddingLeft: 0,
    '&:first-child': {
      borderLeft: '1px solid #00000010',
      paddingLeft: '30px',
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16
    },
    '&:last-child': {
      borderRight: '1px solid #00000010',
      paddingRight: '30px',
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16
    }
  },
  '&:hover': {
    backgroundColor: ' #E2E7F020'
  }
})

const Card = styled('div')(`
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 30px;
  padding: 24px;
  > div {
    width: 100%;
  }
`)

const CardRow = styled('div')(`
  display: flex;
  justify-content: space-between;
  grid-template-columns: auto 100%;
  > div:first-child {
    white-space: nowrap;
  }
  > div:last-child {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`)

export default function Table({ header, rows }: { header: string[]; rows: (string | number | JSX.Element)[][] }) {
  const matches = useBreakpoint()
  return (
    <>
      {matches ? (
        <>
          {rows.map((data, index) => (
            <Card key={index}>
              <Box display="flex" flexDirection="column" gap="16px">
                {header.map((headerString, index) => (
                  <CardRow key={index}>
                    <Typography variant="inherit">{headerString}</Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary }}>
                      {' '}
                      {data[index] ?? null}
                    </Typography>
                  </CardRow>
                ))}
              </Box>
            </Card>
          ))}
        </>
      ) : (
        <StyledTableContainer>
          <table>
            <StyledTableHead>
              <TableRow>
                {header.map((string, idx) => (
                  <TableCell key={idx}>{string}</TableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <StyledTableRow key={row[0].toString() + idx}>
                  {row.map((data, idx) => (
                    <TableCell key={idx}>{data}</TableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </table>
        </StyledTableContainer>
      )}
    </>
  )
}
