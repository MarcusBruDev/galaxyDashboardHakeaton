import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { time: '00:00', energy: 145, storage: 7800 },
  { time: '04:00', energy: 152, storage: 8200 },
  { time: '08:00', energy: 165, storage: 8500 },
  { time: '12:00', energy: 172, storage: 8300 },
  { time: '16:00', energy: 158, storage: 8100 },
  { time: '20:00', energy: 150, storage: 8000 },
]

export function EnergyChart() {
  return (
    <div className="bg-black/40 backdrop-blur rounded-lg border border-cyan-500/30 p-4">
      <h3 className="text-cyan-400 font-bold mb-4">Energy Production</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #06B6D4', borderRadius: '8px' }}
            labelStyle={{ color: '#06B6D4' }}
          />
          <Legend />
          <Line type="monotone" dataKey="energy" stroke="#FBBF24" name="Production (units/min)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="storage" stroke="#06B6D4" name="Storage (units)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
