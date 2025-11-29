export function StatsPanel({ colony, isFloating = false, isCompact = false }) {
  // Handle case where no colony is selected yet
  if (!colony) {
    return (
      <div className="p-6 bg-linear-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-md rounded-2xl border border-cyan-500/40 shadow-2xl text-center">
        <p className="text-gray-400 text-sm">Select a colony to view statistics</p>
      </div>
    );
  }

  // Map data.json structure to our display structure
  const resources = [
    { 
      name: 'Energy', 
      icon: '⚡', 
      production: colony.production?.energy_per_min || colony.production?.energy || 0,
      storage: colony.storage?.energy || 0,
      capacity: 10000,
      color: 'from-yellow-400 to-orange-500',
      shadowColor: 'shadow-yellow-500/50'
    },
    { 
      name: 'Water', 
      icon: '💧',
      production: colony.production?.water_per_min || colony.production?.water || 0,
      storage: colony.storage?.water || 0,
      capacity: 6000,
      color: 'from-blue-300 to-cyan-400',
      shadowColor: 'shadow-blue-400/50'
    },
    { 
      name: 'Oxygen', 
      icon: '💨',
      production: colony.production?.oxygen_per_min || colony.production?.oxygen || 0,
      storage: colony.storage?.oxygen || 0,
      capacity: 4000,
      color: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/50'
    },
    { 
      name: 'Food', 
      icon: '🌾',
      production: colony.production?.food_per_min || colony.production?.food || 0,
      storage: colony.storage?.food || 0,
      capacity: 3500,
      color: 'from-green-400 to-emerald-500',
      shadowColor: 'shadow-green-500/50'
    },
    { 
      name: 'Minerals', 
      icon: '⛏️',
      production: colony.production?.minerals_per_min || colony.production?.minerals || 0,
      storage: colony.storage?.minerals || 0,
      capacity: 9000,
      color: 'from-amber-400 to-orange-600',
      shadowColor: 'shadow-amber-500/50'
    },
  ]

  if (isCompact) {
    // Compact mode for the colonies section
    return (
      <div className="space-y-2">
        {resources.map((resource, idx) => (
          <div key={idx} className="bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 transition-colors p-2.5">
            {/* Resource Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{resource.icon}</span>
                <span className="font-semibold text-gray-200 text-xs">{resource.name}</span>
              </div>
              <span className="text-xs text-gray-500">{resource.storage}/{resource.capacity}</span>
            </div>
            
            {/* Storage Bar Only (compact) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 text-xs">Prod: {resource.production} u/min</span>
                <span className="text-gray-300 font-medium text-xs">{Math.round((resource.storage / resource.capacity) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700/40 h-1.5 rounded-full overflow-hidden">
                <div className={`bg-linear-to-r ${resource.color} h-1.5 rounded-full shadow-lg ${resource.shadowColor}`} 
                     style={{ width: `${(resource.storage / resource.capacity) * 100}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const panelClass = isFloating 
    ? 'w-96 max-h-96 overflow-y-auto p-4 bg-linear-to-br from-slate-900/98 to-slate-950/98 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/60 shadow-2xl text-white'
    : 'p-6 bg-linear-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-md rounded-2xl border border-cyan-500/40 shadow-2xl text-white'

  return (
    <div className={panelClass}>
      {/* Header */}
      <div className={`pb-4 ${isFloating ? 'mb-4 border-b border-cyan-500/20' : 'mb-6 border-b border-cyan-500/20'}`}>
        <h2 className={`font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ${isFloating ? 'text-lg' : 'text-2xl'}`}>
          {colony.name}
        </h2>
        <p className={`text-gray-400 mt-1 ${isFloating ? 'text-xs' : 'text-sm'}`}>
          {isFloating ? `Population: ${colony.population}` : `Population: ${colony.population} | Status: Operational`}
        </p>
      </div>
      
      {/* Resources Grid */}
      <div className={isFloating ? 'space-y-2' : 'space-y-4'}>
        {resources.map((resource, idx) => (
          <div key={idx} className={`bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors ${isFloating ? 'p-2' : 'p-4'}`}>
            {/* Resource Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={isFloating ? 'text-base' : 'text-xl'}>{resource.icon}</span>
                <span className={`font-semibold text-gray-200 ${isFloating ? 'text-sm' : ''}`}>{resource.name}</span>
              </div>
              <span className="text-xs text-gray-500">{resource.storage}/{resource.capacity}</span>
            </div>
            
            {/* Production Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 text-xs">Production</span>
                <span className="text-gray-300 font-medium text-xs">{resource.production} u/min</span>
              </div>
              <div className="w-full bg-slate-700/40 h-1 rounded-full overflow-hidden">
                <div className={`bg-linear-to-r ${resource.color} h-1 rounded-full shadow-lg ${resource.shadowColor}`} 
                     style={{ width: `${(resource.production / 150) * 100}%` }}></div>
              </div>
            </div>
            
            {/* Storage Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 text-xs">Storage</span>
                <span className="text-gray-300 font-medium text-xs">{Math.round((resource.storage / resource.capacity) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700/40 h-1.5 rounded-full overflow-hidden">
                <div className={`bg-linear-to-r ${resource.color} h-1.5 rounded-full shadow-lg ${resource.shadowColor}`} 
                     style={{ width: `${(resource.storage / resource.capacity) * 100}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Footer - Only show if not floating */}
      {!isFloating && (
        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-cyan-500/20">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-cyan-500/20">
            <p className="text-xs text-gray-500 mb-1">Total Population</p>
            <p className="text-lg font-bold text-cyan-400">{colony.population}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-cyan-500/20">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-sm font-bold text-green-400">✓ Operational</p>
          </div>
        </div>
      )}
    </div>
  )
}
