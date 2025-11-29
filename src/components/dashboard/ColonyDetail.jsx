//import marsData from '../../../data.json'
import { createContext , useState, useEffect,useContext} from "react";
import { getPlanetsRequest } from '../../api/planet'


export function ColonyDetail({ colonyId, onClose }) {


  const [marsData, setMarsData]= useState([])


     useEffect(()=>{
            async function getPlanets(){
                    try{
                        const res = await getPlanetsRequest();
                        console.log(res)
                        setMarsData([...res.data]);
                      
                    }catch(error){
                        console.log(error);
                    }
            }
            getPlanets();     
    },[])


    


  const colony = marsData.planet.colonies.find(c => c.id === colonyId)
  const totalPopulation = marsData.planet.population
  const coloniesCount = marsData.planet.colonies.length

  if (!colony) return null

  // Calculate impact on planet
  const populationPercentage = (colony.population / totalPopulation * 100).toFixed(1)

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 rounded-2xl border border-cyan-500/40 shadow-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-slate-900 to-slate-950 border-b border-cyan-500/30 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-cyan-300 mb-1">{colony.name}</h2>
            <p className="text-sm text-gray-400">ID: {colony.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-cyan-400 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
          <div className="p-5 space-y-5">
          
          {/* Impact on Planet */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700/40 p-3">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">Impact on Mars</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Population Contribution</p>
                <div className="relative h-32 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-400">{populationPercentage}%</p>
                    <p className="text-xs text-gray-500 mt-1">{colony.population}/{totalPopulation}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-3 font-semibold">Production Share</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">⚡ Energy:</span>
                    <span className="text-yellow-400 font-semibold">{colony.production.energy_per_min} u/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">💧 Water:</span>
                    <span className="text-blue-300 font-semibold">{colony.production.water_per_min} u/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">💨 Oxygen:</span>
                    <span className="text-blue-400 font-semibold">{colony.production.oxygen_per_min} u/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🌾 Food:</span>
                    <span className="text-green-400 font-semibold">{colony.production.food_per_min} u/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">⛏️ Minerals:</span>
                    <span className="text-amber-400 font-semibold">{colony.production.minerals_per_min} u/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Status */}
          <div className="bg-slate-800/20 rounded-lg border border-slate-700/40 p-3">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">Storage Status</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colony.storage).map(([resource, amount]) => {
                const capacities = {
                  energy: 10000,
                  water: 6000,
                  oxygen: 4000,
                  food: 3500,
                  minerals: 9000
                }
                const capacity = capacities[resource]
                const percentage = (amount / capacity * 100).toFixed(0)
                
                return (
                  <div key={resource} className="bg-slate-800/20 rounded p-3 border border-slate-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-300 capitalize">{resource}</span>
                      <span className="text-xs text-gray-500">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-linear-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{amount}/{capacity}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* History Note */}
          <div className="bg-blue-500/6 rounded-lg border border-blue-500/20 p-3">
            <p className="text-sm text-blue-300">
              📊 <strong>Future Feature:</strong> Detailed historical data and trend analysis will be available here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
