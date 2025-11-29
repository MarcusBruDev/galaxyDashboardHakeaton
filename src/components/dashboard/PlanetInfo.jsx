//import marsData from '../../../data.json'

import { createContext, useState, useEffect, useContext } from "react";
import { getPlanetsRequest } from '../../api/planet'



export function PlanetInfo({ marsData }) {
  console.log("planetas", marsData);

  // Handle case where marsData is not yet loaded
  if (!marsData) {
    return (
      <div className="bg-linear-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-cyan-500/30 p-4">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">Mars Information</h3>
        <p className="text-gray-500 text-sm">Loading planet data...</p>
      </div>
    );
  }

  // marsData is now the planet object directly, not marsData.planet
  const planet = marsData;
  const activeEvents = planet.events?.filter(e => e.active) || [];

  return (
    <div className="bg-linear-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-cyan-500/30 p-3">
      <h3 className="text-base font-bold text-cyan-400 mb-2">Mars Information</h3>

      {/* Planet Header */}
      <div className="mb-2 pb-2 border-b border-cyan-500/20">
        <h4 className="text-lg font-bold text-cyan-300 mb-0.5">{planet.name}</h4>
        <p className="text-xs text-gray-500">{planet.description}</p>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
          <p className="text-xs text-gray-500 mb-0.5">Population</p>
          <p className="text-base font-bold text-cyan-400">{planet.population.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
          <p className="text-xs text-gray-500 mb-0.5">Temperature</p>
          <p className="text-base font-bold text-orange-400">{planet.environment.temperature}°C</p>
        </div>
      </div>

      {/* Environment Info */}
      <div className="mb-2 p-2 bg-slate-800/20 rounded-lg border border-slate-700/50">
        <p className="text-xs text-gray-400 mb-1.5 font-semibold">Environment</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Radiation Level:</span>
            <span className={`font-semibold ${planet.environment.radiation_level === 'high' ? 'text-red-400' :
              planet.environment.radiation_level === 'medium' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
              {planet.environment.radiation_level.toUpperCase()}
            </span>
          </div>
          <div className="text-gray-600 mt-1">
            <p className="text-xs mb-0.5">Atmosphere:</p>
            <div className="ml-2 text-xs space-y-0.5">
              <div>CO₂: {planet.environment.atmosphere.co2.toFixed(1)}%</div>
              <div>N₂: {planet.environment.atmosphere.nitrogen.toFixed(1)}%</div>
              <div>O₂: {planet.environment.atmosphere.oxygen.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Resources */}
      <div className="mb-2 p-2 bg-slate-800/20 rounded-lg border border-slate-700/50">
        <p className="text-xs text-gray-400 mb-1.5 font-semibold">Global Resources</p>
        <div className="space-y-1">
          {Object.entries(planet.global_resources).map(([resource, amount]) => (
            <div key={resource} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{resource}:</span>
              <span className="text-cyan-300 font-semibold">{(amount / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="p-2 bg-slate-800/20 rounded-lg border border-slate-700/50">
        <p className="text-xs text-gray-400 mb-1.5 font-semibold">
          Events {activeEvents.length > 0 && <span className="text-red-400">({activeEvents.length} Active)</span>}
        </p>
        <div className="space-y-1.5">
          {planet.events.map((event) => (
            <div
              key={event.id}
              className={`text-xs p-1.5 rounded border ${event.active
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-slate-700/20 border-slate-600/30 text-gray-500'
                }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${event.active ? 'bg-red-500' : 'bg-gray-600'}`}></span>
                <span className="font-semibold capitalize">{event.type.replace('_', ' ')}</span>
              </div>
              <p className="text-xs opacity-90">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
