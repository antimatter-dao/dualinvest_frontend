import React, { useEffect, useState, useCallback } from 'react'
import { /*Paper,*/ Typography, Box, styled, useTheme, Divider } from '@mui/material'
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineStyle,
  LineType,
  // sMouseEventParams,
  // isBusinessDay,
  // BusinessDay,
  Time
} from 'lightweight-charts'
import dayjs from 'dayjs'
import Spinner from 'components/Spinner'
import useBreakpoint from 'hooks/useBreakpoint'

export type LineSeriesData = Array<{
  time: Time
  value: number
  rate?: string
}>

// type ToolTipInfo = Partial<Omit<MouseEventParams, 'seriesPrices'>> & {
//   price?: string
//   date?: Time
//   price2?: string
// }

const Chart = styled('div')(`
  width: 100%;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3px;
  position: relative;
  min-height: 100%;
`)

const secondaryColor = '#F0B90B'
// const toolTipMargin = 48

// const tooltipFunction = ({
//   series,
//   series2,
//   setToolTipInfo
// }: {
//   series: undefined | ISeriesApi<'Line'>
//   series2?: undefined | ISeriesApi<'Line'>
//   setToolTipInfo: (info: ToolTipInfo | undefined) => void
// }) => (param: MouseEventParams) => {
//   if (!series || !param || !param.point || param.time === undefined) {
//     setToolTipInfo(undefined)
//     return
//   }

//   function businessDayToString(businessDay: BusinessDay) {
//     return businessDay.year + '-' + businessDay.month + '-' + businessDay.day
//   }

//   const date: Time = isBusinessDay(param.time)
//     ? businessDayToString(param.time)
//     : new Date(param.time).toUTCString().slice(4, 16)

//   setToolTipInfo({
//     time: param.time,
//     point: param.point,
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     /* @ts-ignore */
//     price: param.seriesPrices.get(series),
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     /* @ts-ignore */
//     price2: series2 ? param.seriesPrices.get(series2) : undefined,
//     date
//   })
// }

export default function LineChart({
  style,
  lineSeriesData,
  height,
  lineColor,
  // unit,
  // unit2,
  id,
  width,
  strikeData
}: {
  style?: React.CSSProperties
  lineSeriesData: LineSeriesData
  strikeData?: { time: Time; value: number }
  height?: number
  lineColor?: string
  unit: string
  unit2?: string
  id: string
  width?: number
}) {
  const theme = useTheme()
  // const toolTipRef = useRef<HTMLDivElement>(null)
  // const [toolTipInfo, setToolTipInfo] = useState<ToolTipInfo | undefined>(undefined)
  const [strikeLineLeft, setStrikeLineLeft] = useState<number | undefined>(undefined)
  const [strikeLineHeight, setStrikeLineHeight] = useState<number | undefined>(undefined)
  const [chart, setChart] = useState<IChartApi | undefined>(undefined)
  const [priceLine, setPriceLine] = useState<ISeriesApi<'Line'> | undefined>(undefined)
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Line'> | undefined>(undefined)

  const isDownMd = useBreakpoint('md')

  const handleStrikeLine = useCallback(() => {
    if (!strikeData || !chart) {
      return
    }
    const widthEl: HTMLTableCellElement | null = document.querySelector(
      `#${id}-chart table tr:first-child td:first-child`
    )
    const rect = widthEl?.getBoundingClientRect()
    const width = rect?.width || 0
    const height = rect?.height || 0

    const left = chart.timeScale()?.timeToCoordinate?.(strikeData.time)
    if (!left) return

    setStrikeLineLeft((left as number) + width)
    setStrikeLineHeight(height)
  }, [chart, id, strikeData])

  useEffect(() => {
    if (chart) return
    const chartElement = (document.getElementById(id + '-chart') as HTMLDivElement) ?? ''
    if (!chartElement) return
    const chartEl = createChart(chartElement, {
      width: width ? width : chartElement ? chartElement.offsetWidth : 556,
      height: height,
      layout: {
        backgroundColor: 'transparent',
        textColor: theme.palette.text.secondary,
        fontSize: 10,
        fontFamily: 'SF Pro, Roboto, san-serif'
      },
      grid: {
        horzLines: {
          visible: false
        },
        vertLines: {
          style: LineStyle.Dotted,
          color: 'rgba(0, 0, 0, 0.2)'
        }
      }
    })
    chartEl.applyOptions({
      leftPriceScale: { autoScale: true, visible: true, drawTicks: false, borderColor: 'transparent' },
      rightPriceScale: { visible: false },
      timeScale: {
        fixLeftEdge: true,
        rightOffset: 1,
        borderColor: 'rgba(242, 245, 250, 1)',
        timeVisible: true,
        secondsVisible: true,
        shiftVisibleRangeOnNewBar: true,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time)
          const year = date.getUTCFullYear()
          const month = date.getUTCMonth() + 1
          const day = date.getUTCDate()
          return year + '/' + month + '/' + day
        }
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: '#00000010',
          width: 2,
          visible: true,
          labelVisible: false
        },
        horzLine: {
          visible: true,
          labelVisible: true
        }
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false
      },
      handleScale: {
        axisPressedMouseMove: false,
        mouseWheel: false,
        pinch: false
      }
    })
    setChart(chartEl)

    const lineSeries = chartEl.addLineSeries({
      color: lineColor ?? theme.palette.primary.main,
      lineWidth: 1,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lineType: LineType.Simple,
      crosshairMarkerBorderColor: '#ffffff',
      crosshairMarkerBackgroundColor: theme.palette.text.primary,
      priceFormat: {
        type: 'price',
        precision: 2
      }
    })
    handleStrikeLine()
    setLineSeries(lineSeries)
  }, [chart, handleStrikeLine, height, id, lineColor, theme, width])

  useEffect(() => {
    const resizeFunction = () => {
      const chartEl = document.getElementById(id + '-chart')
      if (!chartEl || !chart) return
      const resizeWidth = isDownMd ? window.innerWidth - 60 : width ? width : chartEl.getBoundingClientRect().width
      chart.resize(resizeWidth, height || 174)
      handleStrikeLine()
    }
    window.addEventListener('resize', resizeFunction)

    return () => window.removeEventListener('resize', resizeFunction)
  }, [chart, height, id, width, handleStrikeLine, isDownMd])

  // useEffect(() => {
  //   if (!chart) return
  //   const crossHairfunction = tooltipFunction({
  //     series: lineSeries,
  //     series2: lineSeries2,
  //     setToolTipInfo: info => {
  //       setToolTipInfo(info)
  //     }
  //   })
  //   chart.subscribeCrosshairMove(crossHairfunction)

  //   return () => chart.unsubscribeCrosshairMove(crossHairfunction)
  // }, [chart, lineSeries, lineSeries2, unit, unit2])

  // useEffect(() => {
  //   if (!chart || !strikeData) return
  //   chart.subscribeCrosshairMove(handleStrikeLine)
  //   return () => chart.unsubscribeCrosshairMove(handleStrikeLine)
  // }, [chart, id, lineSeries, strikeData, handleStrikeLine])

  useEffect(() => {
    if (lineSeries) {
      lineSeries.setData(lineSeriesData)
      handleStrikeLine()
    }
    if (chart) {
      chart.timeScale().fitContent()
    }

    // if (chart) {
    //   if (lineSeriesData2) {
    //     const lineSeries2 = chart.addLineSeries({
    //       color: secondaryColor,
    //       lineWidth: 1,
    //       crosshairMarkerVisible: true,
    //       crosshairMarkerRadius: 4,
    //       lineType: LineType.Simple,
    //       crosshairMarkerBorderColor: '#ffffff',
    //       crosshairMarkerBackgroundColor: theme.palette.text.primary,
    //       priceFormat: {
    //         type: 'price',
    //         precision: 2
    //       }
    //     })
    //     setLineSeries2(lineSeries2)
    //     lineSeries2.setData(lineSeriesData2)
    //   }
    // chart.timeScale().fitContent()
    // }
  }, [chart, handleStrikeLine, lineColor, lineSeries, lineSeriesData, strikeData, theme])

  useEffect(() => {
    if (!chart || !strikeData) return
    if (!priceLine) {
      const pl = chart?.addLineSeries({
        lineType: LineType.Simple,
        lineStyle: LineStyle.LargeDashed,
        lineWidth: 1,
        color: secondaryColor,
        crosshairMarkerVisible: false
      })
      setPriceLine(pl)
    }
    priceLine?.setData([strikeData])
  }, [chart, handleStrikeLine, priceLine, strikeData])

  return (
    <>
      <Chart sx={{ ...style }} id={id + '-chart'}>
        {strikeData && strikeLineLeft && strikeLineHeight ? (
          <>
            <Divider
              orientation="vertical"
              sx={{
                width: '2px',
                top: 0,
                position: 'absolute',
                zIndex: 10,
                borderColor: '#31B047',
                height: strikeLineHeight,
                left: strikeLineLeft,
                borderWidth: '1px'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                zIndex: 10,
                top: strikeLineHeight,
                left: strikeLineLeft,
                transform: 'translate(-50%, 1px)',
                background: '#ffffff',
                color: theme => theme.palette.primary.main
              }}
            >
              <Typography align="center" noWrap fontSize={12} fontWeight={700}>
                {dayjs(strikeData.time as number).format('DD MMM YYYY')}
              </Typography>
              <Typography align="center" noWrap fontSize={12} fontWeight={700}>
                (Delivery Date)
              </Typography>
            </Box>
          </>
        ) : (
          <Box
            height="100%"
            width="100%"
            sx={{ background: '#ffffff50', position: 'absolute', zIndex: 3, top: 0 }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size={60} />
          </Box>
        )}

        {/* <Paper
          ref={toolTipRef}
          id={id + 'chartToolTip'}
          sx={{
            display:
              toolTipInfo &&
              toolTipInfo.point &&
              toolTipInfo.time &&
              toolTipInfo.point.x >= 0 &&
              toolTipInfo.point.y >= 0
                ? 'block'
                : 'none',
            position: 'absolute',
            zIndex: 10,
            top: 0,
            padding: '8px 12px',
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.1)',
            '& *': { cursor: 'none' },
            left: (() => {
              if (!toolTipInfo || !toolTipInfo.time || !chart || !chart.timeScale()) return 0
              const coordinate = chart?.timeScale()?.timeToCoordinate(toolTipInfo.time)
              const val = coordinate === null ? 0 : coordinate ?? 0
              return val + toolTipMargin
              // +(toolTipRef?.current?.getBoundingClientRect().width ?? 0) + 'px'
            })()
          }}
        >
          <Box display="grid" gap="8px">
            <Typography fontSize={10} sx={{ color: theme => theme.palette.text.secondary }}>
              {toolTipInfo && toolTipInfo.date}
            </Typography>
            <Box display="flex" gap="8px" alignItems="center">
              <Typography sx={{ color: theme => theme.palette.primary.main }}>{unit}</Typography>
              <Typography fontSize={12}>$</Typography>
              <Typography fontSize={12}>{toolTipInfo && toolTipInfo.price}</Typography>
              {toolTipInfo && <Capsule val={lineSeriesData.find(el => el.time === toolTipInfo.time)?.rate ?? '0%'} />}
            </Box>

            {toolTipInfo && toolTipInfo.price2 && unit2 && (
              <Box display="flex" gap="8px">
                <Typography sx={{ color: secondaryColor }}>{unit2}</Typography>
                <Typography fontSize={12}>$</Typography>
                <Typography fontSize={12}>{toolTipInfo.price2}</Typography>
              </Box>
            )}
          </Box>
        </Paper> */}
      </Chart>
    </>
  )
}

// function Capsule({ val }: { val: string }) {
//   return (
//     <Typography
//       fontSize={12}
//       sx={{
//         minWidth: '56px',
//         textAlign: 'center',
//         padding: '5px 12px',
//         borderRadius: 3,
//         backgroundColor: theme => (val[0] === '-' ? theme.palette.error.light : theme.palette.secondary.main),
//         color: theme => (val[0] === '-' ? theme.palette.error.main : theme.palette.secondary.light)
//       }}
//     >
//       {val}
//     </Typography>
//   )
// }
