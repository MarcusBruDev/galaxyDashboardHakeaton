import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const coloniesData = [
  { name: 'Colonia Solaris', value: 450 },
  { name: 'Colonia Ares', value: 380 },
  { name: 'Colonia Borealis', value: 370 },
]

const COLORS = ['#06B6D4', '#FBBF24', '#10B981']

export function PopulationChart() {
  return (
    <div className="bg-black/40 backdrop-blur rounded-lg border border-cyan-500/30 p-4">
      <h3 className="text-cyan-400 font-bold mb-4">Population Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={coloniesData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {coloniesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #06B6D4', borderRadius: '8px' }}
            labelStyle={{ color: '#06B6D4' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
