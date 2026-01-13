import React, { useState } from 'react';
import { ComposedChart, Bar, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const ProductivityChart = ({ logs }) => {
    const { theme } = useTheme();

    // Filter only completed
    const completedLogs = logs.filter(l => l.status === 'completed');

    // Aggregate by date (last 7 days)
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = format(d, 'MMM dd');

        const dayLogs = completedLogs.filter(l => format(new Date(l.completedAt || l.createdAt), 'MMM dd') === dateStr);

        // Sum points
        const dayPoints = dayLogs.reduce((sum, l) => sum + (l.points || 0), 0);

        // Sum duration (hours)
        const dayDurationMins = dayLogs.reduce((sum, l) => sum + (l.duration || 0), 0);
        const dayDurationHours = parseFloat((dayDurationMins / 60).toFixed(1));

        data.push({
            name: dateStr,
            points: dayPoints,
            hours: dayDurationHours
        });
    }

    const isLight = theme === 'light';
    const axisColor = isLight ? '#71717a' : '#a1a1aa';
    const tickColor = isLight ? '#52525b' : '#d4d4d8';
    const tooltipBg = isLight ? '#ffffff' : '#09090b';
    const tooltipBorder = isLight ? '#e4e4e7' : '#27272a';
    const cursorFill = isLight ? '#e4e4e7' : '#27272a';

    // Points Bar Color (Green-ish)
    const barColor = '#10b981';
    // Hours Area Color (Blue-ish)
    const areaColor = '#3b82f6';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: tickColor }}
                />
                <YAxis
                    yAxisId="left"
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: tickColor }}
                    label={{ value: 'Points', angle: -90, position: 'insideLeft', fill: tickColor, fontSize: 10 }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: tickColor }}
                    label={{ value: 'Hours', angle: 90, position: 'insideRight', fill: tickColor, fontSize: 10 }}
                />
                <Tooltip
                    cursor={{ fill: cursorFill }}
                    contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: '6px'
                    }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />

                <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="hours"
                    fill={areaColor}
                    stroke={areaColor}
                    fillOpacity={0.2}
                    name="Hours Worked"
                />
                <Bar
                    yAxisId="left"
                    dataKey="points"
                    fill={barColor}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    name="Points"
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};


export default ProductivityChart;
