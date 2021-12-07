import {
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  Typography,
  styled,
  IconButton,
  Collapse
} from '@mui/material'
import { useState } from 'react'
import useBreakpoint from '../../hooks/useBreakpoint'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

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
  borderRadius: '40px',
  '& .MuiTableCell-root': {
    borderBottom: 'none',
    fontWeight: 400,
    padding: '14px 20px',
    '&:first-of-type': {
      paddingLeft: 20
    },
    '&:last-child': {
      paddingRight: 20
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
    fontSize: '12px',
    whiteSpace: 'nowrap',
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '12px 20px 12px 0',
    color: theme.palette.text.secondary,
    borderBottom: 'none',
    '&:first-of-type': {
      paddingLeft: 20,
      borderTopLeftRadius: 8
    },
    '&:last-child': {
      paddingRight: 20,
      borderTopRightRadius: 8
    }
  }
}))

const StyledTableRow = styled(TableRow, { shouldForwardProp: () => true })<{ variant: 'outlined' | 'grey' }>(
  ({ variant, theme }) => ({
    height: 80,
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    background: variant === 'outlined' ? 'transparent' : theme.palette.background.default,
    '& + tr .MuiCollapse-root': {
      background: variant === 'outlined' ? 'transparent' : theme.palette.background.default
    },
    '& .MuiTableCell-root': {
      fontSize: '16px',
      justifyContent: 'flex-start',
      paddingLeft: 0,
      border: '1px solid',
      borderColor: variant === 'outlined' ? '#00000010' : 'transparent',
      borderRight: 'none',
      borderLeft: 'none',
      '&:first-of-type': {
        borderLeft: '1px solid',
        borderColor: variant === 'outlined' ? '#00000010' : 'transparent',
        paddingLeft: '20px',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16
      },
      '&:last-child': {
        borderRight: '1px solid',
        borderColor: variant === 'outlined' ? '#00000010' : 'transparent',
        paddingRight: '20px',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16
      }
    },
    '&:hover': {
      '& + tr .MuiCollapse-root': {
        backgroundColor: variant === 'outlined' ? '#E2E7F020' : '#E2E7F0'
      },
      backgroundColor: variant === 'outlined' ? '#E2E7F020' : '#E2E7F0'
    }
  })
)

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
  > div:first-of-type {
    white-space: nowrap;
  }
  > div:last-child {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`)

export default function Table({
  header,
  rows,
  variant = 'grey',
  collapsible,
  hiddenParts
}: {
  header: string[]
  rows: (string | number | JSX.Element)[][]
  variant?: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenParts?: JSX.Element[]
}) {
  const matches = useBreakpoint('md')

  return (
    <>
      {matches ? (
        <>
          {rows.map((data, index) => (
            <Card key={index}>
              <Box display="flex" flexDirection="column" gap="16px">
                {header.map((headerString, index) => (
                  <CardRow key={index}>
                    <Typography variant="inherit" component="div">
                      {headerString}
                    </Typography>
                    <Typography sx={{ color: theme => theme.palette.text.secondary }} component="div">
                      {data[index] ?? null}
                    </Typography>
                    {collapsible && index + 1 === header.length && (
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        // onClick={() => setIsOpen(open => !open)}
                        sx={{ flexGrow: 0 }}
                      >
                        <KeyboardArrowUpIcon />
                        {/* {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
                      </IconButton>
                    )}
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
                <Row
                  row={row}
                  collapsible={collapsible}
                  key={row[0].toString() + idx}
                  variant={variant}
                  hiddenPart={hiddenParts && hiddenParts[idx]}
                />
              ))}
            </TableBody>
          </table>
        </StyledTableContainer>
      )}
    </>
  )
}

function Row({
  row,
  variant,
  collapsible,
  hiddenPart
}: {
  row: (string | number | JSX.Element)[]
  variant: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenPart?: JSX.Element
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <StyledTableRow
        variant={variant}
        sx={
          isOpen
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                '& .MuiTableCell-root': {
                  '&:first-of-type': { borderBottomLeftRadius: 0 },
                  '&:last-child': { borderBottomRightRadius: 0 }
                }
              }
            : undefined
        }
      >
        {row.map((data, idx) => (
          <TableCell key={idx}>{data}</TableCell>
        ))}
        {collapsible && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsOpen(open => !open)}
              sx={{ flexGrow: 0 }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </StyledTableRow>
      {collapsible && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={row.length + 5}>
            <Collapse
              in={isOpen}
              timeout="auto"
              sx={{
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                width: '100%',
                marginTop: -8
              }}
            >
              <Box
                sx={{
                  // backgroundColor: '#E2E7F0',
                  padding: 28,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  transition: '.5s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                // display="flex"
                // alignItems="center"
                // justifyContent="space-between"
              >
                {hiddenPart}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
