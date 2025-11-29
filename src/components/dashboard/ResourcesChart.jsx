import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { resource: 'Energy', production: 150, storage: 8000, capacity: 10000 },
  { resource: 'Water', production: 20, storage: 5000, capacity: 6000 },
  { resource: 'Oxygen', production: 15, storage: 3000, capacity: 4000 },
  { resource: 'Food', production: 10, storage: 2500, capacity: 3500 },
  { resource: 'Minerals', production: 30, storage: 7000, capacity: 9000 },
]

export function ResourcesChart() {
  return (
    <div className="bg-black/40 backdrop-blur rounded-lg border border-cyan-500/30 p-4">
      <h3 className="text-cyan-400 font-bold mb-4">Resource Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="resource" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #06B6D4', borderRadius: '8px' }}
            labelStyle={{ color: '#06B6D4' }}
          />
          <Legend />
          <Bar dataKey="production" fill="#FBBF24" name="Production/min" />
          <Bar dataKey="storage" fill="#06B6D4" name="Current Storage" />
          <Bar dataKey="capacity" fill="#059669" name="Capacity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
