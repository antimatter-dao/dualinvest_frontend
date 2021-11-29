import React, { useEffect, useState, useRef } from 'react'
import { Paper, styled, useTheme, Typography, Box } from '@mui/material'
import {
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineStyle,
  LineType,
  MouseEventParams,
  isBusinessDay,
  BusinessDay,
  Time
} from 'lightweight-charts'

export type LineSeriesData = Array<{
  time: Time
  value: number
  rate?: string
}>

type ToolTipInfo = Partial<Omit<MouseEventParams, 'seriesPrices'>> & {
  price?: string
  date?: Time
  price2?: string
}

const Chart = styled('div')(`
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3px;
  position: relative
`)

const secondaryColor = '#F0B90B'
const toolTipMargin = 48

const tooltipFunction = ({
  series,
  series2,
  setToolTipInfo
}: {
  series: undefined | ISeriesApi<'Line'>
  series2?: undefined | ISeriesApi<'Line'>
  setToolTipInfo: (info: ToolTipInfo | undefined) => void
}) => (param: MouseEventParams) => {
  if (!series || !param || !param.point || param.time === undefined) {
    setToolTipInfo(undefined)
    return
  }

  function businessDayToString(businessDay: BusinessDay) {
    return businessDay.year + '-' + businessDay.month + '-' + businessDay.day
  }

  const date: Time = isBusinessDay(param.time)
    ? businessDayToString(param.time)
    : new Date(param.time).toUTCString().slice(4, 16)

  setToolTipInfo({
    time: param.time,
    point: param.point,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    price: param.seriesPrices.get(series),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    price2: series2 ? param.seriesPrices.get(series2) : undefined,
    date
  })
}

export default function LineChart({
  style,
  lineSeriesData,
  lineSeriesData2,
  height,
  lineColor,
  unit,
  unit2,
  id
}: {
  style?: React.CSSProperties
  lineSeriesData: LineSeriesData
  lineSeriesData2?: LineSeriesData
  height?: number
  lineColor?: string
  unit: string
  unit2?: string
  id: string
}) {
  const theme = useTheme()
  const toolTipRef = useRef<HTMLDivElement>(null)
  const [toolTipInfo, setToolTipInfo] = useState<ToolTipInfo | undefined>(undefined)
  const [chart, setChart] = useState<IChartApi | undefined>(undefined)
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Line'> | undefined>(undefined)
  const [lineSeries2, setLineSeries2] = useState<ISeriesApi<'Line'> | undefined>(undefined)

  useEffect(() => {
    const chartElement = (document.getElementById(id + '-chart') as HTMLDivElement) ?? ''
    if (!chartElement) return
    const chart = createChart(chartElement, {
      width: chartElement ? chartElement.offsetWidth : 556,
      height: height,
      layout: {
        backgroundColor: 'transparent',
        textColor: theme.palette.text.secondary,
        fontSize: 10,
        fontFamily: 'SF Pro, Roboto, san-serif'
      },
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          style: LineStyle.Dotted,
          color: 'rgba(242, 245, 250, 1)'
        }
      }
    })
    chart.applyOptions({
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
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#00000020',
          width: 2,
          style: LineStyle.Solid,
          visible: true,
          labelVisible: false
        },
        horzLine: {
          visible: false,
          labelVisible: false
        }
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true
      }
    })
    setChart(chart)

    const lineSeries = chart.addLineSeries({
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
    setLineSeries(lineSeries)

    const resizeFunction = () => {
      const chartEl = document.getElementById(id + '-chart')
      if (!chartEl || !chart) return
      chart.resize(chartEl.getBoundingClientRect().width, height || 174)
    }
    window.addEventListener('resize', resizeFunction)

    return () => window.removeEventListener('resize', resizeFunction)
  }, [height, id, lineColor, theme])

  useEffect(() => {
    if (!chart) return
    const crossHairfunction = tooltipFunction({
      series: lineSeries,
      series2: lineSeries2,
      setToolTipInfo: info => {
        setToolTipInfo(info)
      }
    })
    chart.subscribeCrosshairMove(crossHairfunction)

    return () => chart.unsubscribeCrosshairMove(crossHairfunction)
  }, [chart, lineSeries, lineSeries2, unit, unit2])

  useEffect(() => {
    if (lineSeries) {
      lineSeries.setData(lineSeriesData)
    }

    if (chart) {
      if (lineSeriesData2) {
        const lineSeries2 = chart.addLineSeries({
          color: secondaryColor,
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
        setLineSeries2(lineSeries2)
        lineSeries2.setData(lineSeriesData2)
      }
      chart.timeScale().fitContent()
    }
  }, [chart, lineColor, lineSeries, lineSeriesData, lineSeriesData2, theme])

  return (
    <>
      <Chart sx={{ ...style }} id={id + '-chart'}>
        <Paper
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
        </Paper>
      </Chart>
    </>
  )
}

function Capsule({ val }: { val: string }) {
  return (
    <Typography
      fontSize={12}
      sx={{
        minWidth: '56px',
        textAlign: 'center',
        padding: '5px 12px',
        borderRadius: 3,
        backgroundColor: theme => (val[0] === '-' ? theme.palette.error.light : theme.palette.secondary.main),
        color: theme => (val[0] === '-' ? theme.palette.error.main : theme.palette.secondary.light)
      }}
    >
      {val}
    </Typography>
  )
}
