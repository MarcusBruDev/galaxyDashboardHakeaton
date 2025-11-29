import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { category: 'Energy', value: 75 },
  { category: 'Water', value: 85 },
  { category: 'Oxygen', value: 70 },
  { category: 'Food', value: 65 },
  { category: 'Minerals', value: 80 },
  { category: 'Population', value: 60 },
]

export function RadarChartComponent() {
  return (
    <div className="bg-black/40 backdrop-blur rounded-lg border border-cyan-500/30 p-4">
      <h3 className="text-cyan-400 font-bold mb-4">Colony Health Index</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="category" stroke="#9CA3AF" />
          <PolarRadiusAxis stroke="#9CA3AF" />
          <Radar 
            name="Health Score" 
            dataKey="value" 
            stroke="#06B6D4" 
            fill="#06B6D4" 
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #06B6D4', borderRadius: '8px' }}
            labelStyle={{ color: '#06B6D4' }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}
