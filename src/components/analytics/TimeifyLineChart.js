import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

class CustomizedLabel extends PureComponent {
    render() {
      const { x, y, stroke, value } = this.props;
  
      return (
        <text x={x} y={y} dy={-10} fill={stroke} fontSize={15} textAnchor="middle">
          {value}
        </text>
      );
    }
}
  
class CustomizedAxisTick extends PureComponent {
    render() {
        const { x, y, stroke, payload } = this.props;

        return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
            {payload.value}
            </text>
        </g>
        );
    }
}

export default function TimeifyLineChart(props) {

  const tickFormatter = (tick) => {
    if (props.yAxisTickModifier) {
      return tick + props.yAxisTickModifier
    }
    return tick
  }

  const tooltipFormatter = (value, name, props) => {
    var formattedName = name
    var formattedValue = value
    if (name === "averageDuration") {
      formattedName = "Average Duration"
      formattedValue = value + " minutes"
    } else if (name === "totalDuration") {
      formattedName = "Total Duration"
      formattedValue = value + " minutes"
    } else if (name === "percentEstimationAccuracy") {
      formattedName = "Estimation Accuracy"
      formattedValue = value + "%"
    } else if (name === "averageEffortRating") {
      formattedName = "Average Effort Rating"
    }
    return [formattedValue, formattedName]
  }

    return (
        <LineChart
            width={1000}
            height={425}
            data={props.data}
            margin={{
              top: 25,
              right: 40,
              left: 30,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={props.xDataKey} height={60} tick={<CustomizedAxisTick />} label={{ value: props.xLabel, position: 'bottom', offset: -5}} />
            <YAxis type="number" label={{ value: props.yLabel, position: "insideTopLeft", offset: -23}} tickFormatter={tickFormatter}/>
            {/* <YAxis label={{ value: props.yLabel, angle: -90, position: 'insideleft', offset: -20}} /> */}
            <Line type="monotone" dataKey={props.yDataKey} stroke="#2d728f" strokeWidth={3}>
              <LabelList dataKey={props.yDataKey} position="top" offset={10}/>
            </Line>
            <Tooltip formatter={tooltipFormatter}/>
        </LineChart>
    );
}