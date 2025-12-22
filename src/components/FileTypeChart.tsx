'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface FileTypeChartProps {
    data: Array<{
        type: string
        count: number
    }>
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function FileTypeChart({ data }: FileTypeChartProps) {
    const chartData = data.map(item => ({
        name: item.type === 'pyq' ? 'Question Papers' : 'Notes',
        value: item.count,
        type: item.type
    }))

    const renderCustomLabel = (entry: any) => {
        const percentage = ((entry.value / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)
        return `${percentage}%`
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Files by Type</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}