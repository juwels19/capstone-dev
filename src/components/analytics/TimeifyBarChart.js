import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, CustomizedAxisTick, Legend } from 'recharts';

export default function TimeifyBarChart(props) {

  const tickFormatter = (tick) => {
    if (props.yAxisTickModifier) {
      return tick + props.yAxisTickModifier
    }
    return tick
  }

  const legendFormatter = (value, entry, index) => {
    console.log(value, entry, index)
    var formattedName = value;
    if (value === "averageDuration") {
      formattedName = "Average Duration"
    } else if (value === "totalSessionsInCourse") {
      formattedName = "Total Sessions in Course"
    } else if (value === "totalDuration") {
      formattedName = "Total Duration"
    } else if (value === "estimationAccuracy") {
      formattedName = "Estimation Accuracy"
    } else if (value === "averageEffortRating") {
      formattedName = "Average Effort Rating"
    }
    return formattedName
  }

  const tooltipFormatter = (value, name, props) => {
    var formattedName = name
    var formattedValue = value
    if (name === "averageDuration") {
      formattedName = "Average Duration"
      formattedValue = value + " minutes"
    } else if (name === "totalSessionsInCourse") {
      formattedName = "Total Sessions in Course"
    } else if (name === "totalDuration") {
      formattedName = "Total Duration"
      formattedValue = value + " minutes"
    } else if (name === "estimationAccuracy") {
      formattedName = "Estimation Accuracy"
      formattedValue = value + "%"
    } else if (name === "averageEffortRating") {
      formattedName = "Average Effort Rating"
    }
    return [formattedValue, formattedName]
  }

  return (
      <BarChart
          width={1000}
          height={425}
          data={props.data}
          margin={{
          top: 25,
          right: 25,
          left: 25,
          bottom: 10,
          }}
          barCategoryGap={10}
      >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={props.xDataKey} height={60} label={{ value: props.xLabel, position: 'bottom', offset: -15}} />
          <YAxis type="number" yAxisId="left" label={{ value: props.yLabel, position: "insideTopLeft", offset: -23}} tickFormatter={tickFormatter}/>
          {props.includeSessionCount && 
            <YAxis type="number" yAxisId="right" orientation="right" label={{ value: "Session Count", position: "insideTopRight", offset: -23}}/>
          }
          <Tooltip formatter={tooltipFormatter}/>
          {props.includeSessionCount && 
            <Legend align="center" formatter={legendFormatter}/>
          }
          <Bar yAxisId="left" dataKey={props.yDataKey} fill="#2d728f" maxBarSize={100}>
            <LabelList dataKey={props.yDataKey} position="top"/>
          </Bar>
          {props.includeSessionCount && 
            <Bar yAxisId="right" dataKey="totalSessionsInCourse" fill="#f49e4c" maxBarSize={100}>
              <LabelList dataKey="totalSessionsInCourse" position="top"/>
            </Bar>
          }
      </BarChart>
  );
}