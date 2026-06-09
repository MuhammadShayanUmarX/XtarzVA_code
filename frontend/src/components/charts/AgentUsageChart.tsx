import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'

interface AgentUsageData {
  agentType: string
  count: number
}

interface AgentUsageChartProps {
  data: AgentUsageData[]
}

export default function AgentUsageChart({ data }: AgentUsageChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No usage data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
        <XAxis type="number" stroke="rgba(245, 245, 247, 0.7)" style={{ fontSize: '12px' }} />
        <YAxis 
          type="category" 
          dataKey="agentType" 
          stroke="rgba(245, 245, 247, 0.7)" 
          style={{ fontSize: '12px' }}
          width={120}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(26, 31, 58, 0.95)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '8px',
            color: '#F5F5F7'
          }}
          labelStyle={{ color: '#F5F5F7', marginBottom: '4px' }}
        />
        <Bar 
          dataKey="count" 
          fill="url(#colorGradient)"
          radius={[0, 8, 8, 0]}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#00FFF0" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

