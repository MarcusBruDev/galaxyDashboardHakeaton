import { useState } from 'react'
import { MarsGlobe } from './components/3d/MarsGlobe'
import { StatsPanel } from './components/dashboard/StatsPanel'
import { EnergyChart } from './components/dashboard/EnergyChart'
import { ResourcesChart } from './components/dashboard/ResourcesChart'
import { PopulationChart } from './components/dashboard/PopulationChart'
import { RadarChartComponent } from './components/dashboard/RadarChart'
import { PlanetInfo } from './components/dashboard/PlanetInfo'
import { ColonyDetail } from './components/dashboard/ColonyDetail'

// Import Mars data
import marsData from '../data.json'

function App() {
  const colonies = marsData.planet.colonies
  const [selectedColony, setSelectedColony] = useState(colonies[0])
  const [selectedColonyId, setSelectedColonyId] = useState(null)

  const handleColonyClick = (colonyId) => {
    setSelectedColonyId(colonyId)
  }

  return (
    <div className="w-screen h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <div className="h-16 bg-linear-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md border-b border-cyan-500/20 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            MARS COLONY CONTROL SYSTEM
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-sm text-green-400 font-medium">
            ● All Systems Operational
          </div>
          <div className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-sm text-cyan-400 font-medium">
            Active: {colonies.length} Colonies
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        
        {/* Left: 3D Mars Globe - Full height */}
        <div 
          className="w-3/5 flex flex-col bg-linear-to-b from-slate-900 to-slate-950 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <h2 className="text-lg font-bold text-cyan-400">3D Interactive Globe</h2>
            <p className="text-xs text-gray-500">Click colonies • Drag to rotate • Scroll to zoom</p>
          </div>
          
          <div className="flex-1 relative">
            <MarsGlobe onColonyClick={handleColonyClick} />
          </div>
        </div>

        {/* Right: Charts Dashboard - 40% width */}
        <div className="w-2/5 flex flex-col gap-4 overflow-y-auto bg-linear-to-br from-slate-900/50 to-slate-950/50 rounded-2xl border border-cyan-500/20 p-4">
          
          {/* Planet Info */}
          <PlanetInfo />

          {/* Charts Stack */}
          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-cyan-400 mb-1">Real-time Analytics</h2>
              <p className="text-xs text-gray-500">Colony statistics & monitoring</p>
            </div>

            <EnergyChart />
            <PopulationChart />
            <ResourcesChart />
            <RadarChartComponent />
            
            {/* Colonies Section */}
            <div className="bg-linear-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-cyan-500/30 p-4 mt-4">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Colonies</h3>
              
              {/* Dropdown */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">Select Colony</label>
                <select
                  value={selectedColony.id}
                  onChange={(e) => setSelectedColony(colonies.find(c => c.id === e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-cyan-500/30 text-cyan-300 text-sm focus:border-cyan-500/60 focus:outline-none hover:border-cyan-500/50 transition-colors"
                >
                  {colonies.map((colony) => (
                    <option key={colony.id} value={colony.id} className="bg-slate-900 text-cyan-300">
                      {colony.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Colony Stats */}
              <StatsPanel colony={selectedColony} isFloating={false} isCompact={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Colony Detail Modal */}
      {selectedColonyId && (
        <ColonyDetail 
          colonyId={selectedColonyId} 
          onClose={() => setSelectedColonyId(null)} 
        />
      )}
    </div>
  )
}

export default App
