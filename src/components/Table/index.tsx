import styled from 'styled-components'
import { TableContainer, TableHead, TableCell, TableRow, TableBody, Box, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import useBreakpoint from '../../hooks/useBreakpoint'

const Profile = styled.div`
  display: flex;
  align-items: center;
`

export const TableProfileImg = styled.div<{ url?: string }>`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
  background: #000000 ${({ url }) => (url ? `url(${url})` : '')};
`

export function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <TableProfileImg url={url} />
      {name}
    </Profile>
  )
}

const useStyles = makeStyles({
  root: {
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
      borderSpacing: 0
    }
  },
  tableHeader: {
    borderRadius: 8,
    overflow: 'hidden',
    '& .MuiTableCell-root': {
      background: 'rgba(255, 255, 255, 0.08)',
      padding: '12px 20px',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.5)',
      borderBottom: 'none',
      '&:first-child': {
        paddingLeft: 50,
        borderTopLeftRadius: 8
      },
      '&:last-child': {
        paddingRight: 50,
        borderTopRightRadius: 8
      }
    }
  },
  tableRow: {
    height: 72,
    '& .MuiTableCell-root': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    },
    '&:hover': {
      backgroundColor: ' rgba(255, 255, 255, 0.02)'
    }
  }
})

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 30px;
  padding: 24px;
  > div {
    width: 100%;
  }
`

const CardRow = styled.div`
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
`

export default function Table({ header, rows }: { header: string[]; rows: (string | number | JSX.Element)[][] }) {
  const classes = useStyles()
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
                    <Typography style={{ color: '#fff' }}> {data[index] ?? null}</Typography>
                  </CardRow>
                ))}
              </Box>
            </Card>
          ))}
        </>
      ) : (
        <TableContainer className={classes.root}>
          <table>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                {header.map((string, idx) => (
                  <TableCell key={idx}>{string}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row[0].toString() + idx} className={classes.tableRow}>
                  {row.map((data, idx) => (
                    <TableCell key={idx}>{data}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </TableContainer>
      )}
    </>
  )
}
