// import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TurnoverChart = () => {
    const data = [
        { month: 'Déc.', value: 5 },
        { month: 'Janv.', value: 8 },
        { month: 'Févr.', value: 12 },
        { month: 'Mars', value: 18 },
        { month: 'Avr.', value: 15 },
        { month: 'Mai', value: 10 },
        { month: 'Juin', value: 8 },
        { month: 'Juil.', value: 14 },
        { month: 'Août', value: 25 },
        { month: 'Sept.', value: 18 },
        { month: 'Oct.', value: 12 },
        { month: 'Nov.', value: 8 }
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    TURNOVER PAR ÉTABLISSEMENT
                </h2>
                <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-900">S31 2023</div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                        <span className="text-gray-600">9,62 %</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0d9488"
                        strokeWidth={2}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TurnoverChart;