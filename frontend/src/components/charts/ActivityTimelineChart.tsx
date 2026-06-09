import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Activity } from 'lucide-react'

interface ActivityData {
  date: string
  count: number
}

interface ActivityTimelineChartProps {
  data: ActivityData[]
}

export default function ActivityTimelineChart({ data }: ActivityTimelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No activity data available</p>
      </div>
    )
  }

  // Format data for chart
  const chartData = data.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    count: day.count,
    fullDate: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(245, 245, 247, 0.7)" 
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="rgba(245, 245, 247, 0.7)" 
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(26, 31, 58, 0.95)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '8px',
            color: '#F5F5F7'
          }}
          labelStyle={{ color: '#F5F5F7', marginBottom: '4px' }}
          formatter={(value: number, name: string, props: any) => [
            `${value} activities on ${props.payload.fullDate}`,
            'Count'
          ]}
        />
        <Bar 
          dataKey="count" 
          radius={[8, 8, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#barGradient${index})`}
            />
          ))}
        </Bar>
        <defs>
          {chartData.map((_, index) => (
            <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="50%" stopColor="#00FFF0" />
              <stop offset="100%" stopColor="#B24BF3" />
            </linearGradient>
          ))}
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

