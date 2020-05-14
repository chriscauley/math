import React from 'react'
import { range, sum } from 'lodash'
import css from '@unrest/css'
import ConfigHook from '@unrest/react-config-hook'
import { VictoryLine, VictoryChart } from 'victory'

const resolution = 0.3
const PERIODS = 3
const DOMAIN = Math.PI * PERIODS
const TERMS = 5 * PERIODS

const base_colors = {
  red: '#e6261f',
  orange: '#eb7532',
  yellow: '#f7d038',
  green: '#a3e048',
  teal: '#49da9a',
  blue: '#34bbe6',
  indigo: '#4355db',
  purple: '#d23be7',
}

const COLORS = Object.values(base_colors)

const uiSchema = {
  highlight: {
    'ui:widget': 'range',
  },
}

const series_names = ['cos', 'sin']

const initial = {
  formData: {
    series: 'cos',
    highlight: 0,
  },
}

const schema = {
  type: 'object',
  required: ['series'],
  properties: {
    series: {
      type: 'string',
      enum: series_names,
    },
    highlight: {
      type: 'integer',
      maximum: TERMS - 1,
      minimum: 0,
    },
  },
}

const TermBox = ({ odd, n }) => (
  <span className="flex items-center" key={n}>
    <span className="mx-2">{odd ? '-' : '+'}</span>
    <div className="text-center">
      x<sup>{n}</sup>
      <div className={denominator}>{n} !</div>
    </div>
  </span>
)

const LegendBox = ({ color, n, children }) => (
  <div className="flex items-center">
    <span
      className="w-4 h-4 border-black inline-block mr-2"
      style={{ background: color || COLORS[n % COLORS.length] }}
    />
    {children}
  </div>
)

const withConfig = ConfigHook('taylor_series', { schema, uiSchema, initial })

const factorial = { 0: 1 }
range(1, TERMS * TERMS).forEach((i) => (factorial[i] = factorial[i - 1] * i))

const xs = range(-DOMAIN, DOMAIN + 1, resolution)
const denominator = 'border-t border-black mt-1 pt-1'

const SERIES = {
  cos: {
    taylor_terms: range(TERMS).map((n) => {
      return xs.map((x) => {
        return {
          x,
          y: (Math.pow(-1, n) * Math.pow(x, 2 * n)) / factorial[2 * n],
        }
      })
    }),
    taylor: (x, terms) =>
      sum(
        range(terms).map(
          (n) => (Math.pow(-1, n) * Math.pow(x, n * 2)) / factorial[n * 2],
        ),
      ),
    getTerm: (n) => TermBox({ odd: n % 2, n: n * 2 }),
  },
  sin: {
    taylor_terms: range(TERMS).map((n) => {
      return xs.map((x) => {
        return {
          x,
          y: (Math.pow(-1, n) * Math.pow(x, 2 * n + 1)) / factorial[2 * n + 1],
        }
      })
    }),
    taylor: (x, terms) =>
      sum(
        range(terms).map(
          (n) =>
            (Math.pow(-1, n) * Math.pow(x, n * 2 + 1)) / factorial[n * 2 + 1],
        ),
      ),
    getTerm: (n) => TermBox({ odd: n % 2, n: n * 2 + 1 }),
  },
}
window.SERIES = SERIES

series_names.forEach((series_name) => {
  const _series = SERIES[series_name]
  _series.name = series_name
  _series.terms = range(TERMS).map((n) => _series.getTerm(n))
  _series.terms_legend = _series.terms.map((term, n) => (
    <LegendBox n={n} key={n}>
      {term}
    </LegendBox>
  ))

  const series_children = []
  _series.series_formula = []
  _series.series_legend = _series.terms.map((current_term, n) => {
    series_children.push(current_term)
    const formula =
      series_children.length > 5
        ? ['...', ...series_children.slice(series_children.length - 5)]
        : series_children.slice()
    _series.series_formula.push(formula)
    return (
      <LegendBox n={n} key={n}>
        {formula}
      </LegendBox>
    )
  })

  _series.perfect = xs.map((x) => ({ x, y: Math[series_name](x) }))
  _series.taylor_series = range(1, TERMS + 1).map((terms) =>
    xs.map((x) => ({ x, y: _series.taylor(x, terms) })),
  )

  _series.taylor_series_error = _series.taylor_series.map((series) => {
    return series.map((xy) => ({
      x: xy.x,
      y: xy.y - Math[series_name](xy.x),
    }))
  })
  _series.taylor_series_error_periodic = _series.taylor_series.map(
    (series, i) => {
      return series.map((xy) => ({
        x: xy.x,
        y:
          Math[series_name](xy.x) - _series.taylor(xy.x % (Math.PI * 2), i + 1),
      }))
    },
  )

  // truncating at y values as it seems to improve graph performance a bit
  _series.taylor_series.forEach((series, i) => {
    _series.taylor_series[i] = series.filter((xy) => xy.y < 4)
  })
  _series.taylor_terms.forEach((series, i) => {
    _series.taylor_terms[i] = series.filter((xy) => xy.y < 4)
  })
})

const Chart = ({
  mainSeries,
  otherSeries = [],
  highlight,
  colors = COLORS,
  y_domain = [-2, 2],
}) => (
  <VictoryChart padding={10} domain={{ y: y_domain }}>
    {mainSeries && <VictoryLine data={mainSeries} />}
    {otherSeries.map((line, i) => (
      <VictoryLine
        data={line}
        style={{
          data: {
            stroke: colors[i % colors.length],
            strokeWidth: highlight === i ? 9 : 2,
          },
        }}
        key={i}
      />
    ))}
    {highlight < otherSeries.length && (
      <VictoryLine
        data={otherSeries[highlight]}
        style={{
          data: {
            stroke: 'black',
            strokeWidth: 2,
          },
        }}
      />
    )}
  </VictoryChart>
)

const Charts = withConfig((props) => {
  const row = 'flex flex-wrap border-b pb-4 mb-4'
  const { highlight, series } = props.config.formData
  const _color = COLORS[highlight % COLORS.length]
  if (!series) {
    return <h2 className={css.h2()}>Select a series</h2>
  }
  return (
    <>
      <h2 className={css.h2()}>Taylor series for {series}</h2>
      <div className={row}>
        <div className="w-1/2">
          <Chart
            mainSeries={SERIES[series].perfect}
            otherSeries={SERIES[series].taylor_terms}
            highlight={highlight}
          />
        </div>
        <div>{SERIES[series].terms_legend[highlight]}</div>
      </div>
      <div className={row}>
        <div className="w-1/2">
          <Chart
            mainSeries={SERIES[series].perfect}
            otherSeries={SERIES[series].taylor_series}
            highlight={highlight}
          />
        </div>
        <div>{SERIES[series].series_legend[highlight]}</div>
      </div>
      <div className={row}>
        <div className="w-1/2">
          <Chart
            mainSeries={SERIES[series].perfect}
            otherSeries={[
              SERIES[series].taylor_series_error[highlight],
              SERIES[series].taylor_series[highlight],
            ]}
            colors={[base_colors.red, _color]}
            highlight={1}
            y_domain={[-1, 1]}
          />
        </div>
        <div>
          <LegendBox color="black">{series}(x)</LegendBox>
          <LegendBox color={_color}>
            T({highlight}) = {SERIES[series].series_formula[highlight]}
          </LegendBox>
          <LegendBox color={base_colors.red}>
            {series}(x) - T({highlight})
          </LegendBox>
        </div>
      </div>
    </>
  )
})

export default function Cos() {
  return (
    <div className="flex -mx-2 w-full">
      <div className="w-1/4 p-2">
        <div className="m-2 p-2 border sticky top-0">
          <withConfig.Form customButton={true} autosubmit={true} />
        </div>
      </div>
      <div className="w-3/4 p-2">
        <Charts />
      </div>
    </div>
  )
}
