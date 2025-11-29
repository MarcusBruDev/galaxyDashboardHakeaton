import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getPlanetHistoriesRequest } from '../../api/planet';

export const TemperatureHistoryChart = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                setLoading(true);
                const response = await getPlanetHistoriesRequest();

                // Transformar los datos para el gráfico
                const chartData = response.data
                    .map(entry => ({
                        timestamp: new Date(entry.createdAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }),
                        temperature: entry.environment?.temperature || 0,
                        fullDate: new Date(entry.createdAt).toLocaleString('es-ES')
                    }))
                    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
                    .slice(-50); // Últimos 50 registros

                setHistoryData(chartData);
            } catch (err) {
                console.error('Error fetching temperature history:', err);
                setError('No se pudo cargar el historial');
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();

        // Actualizar cada 30 segundos
        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, []);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
                    <p className="text-cyan-400 text-sm font-bold mb-1">
                        {payload[0].payload.fullDate}
                    </p>
                    <p className="text-orange-400 text-lg font-bold">
                        {payload[0].value.toFixed(2)}°C
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-cyan-500/30 p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Historial de Temperatura</h3>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-red-500/30 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4">Historial de Temperatura</h3>
                <div className="flex items-center justify-center h-64">
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (historyData.length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-cyan-500/30 p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Historial de Temperatura</h3>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-400 text-sm">No hay datos históricos disponibles</p>
                </div>
            </div>
        );
    }

    // Calcular estadísticas
    const temperatures = historyData.map(d => d.temperature);
    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);

    return (
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 rounded-lg border border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-cyan-400">Historial de Temperatura</h3>
                    <p className="text-xs text-gray-500">Evolución continua en tiempo real</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400">{historyData.length} registros</span>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                    <p className="text-xs text-gray-400 mb-1">Promedio</p>
                    <p className="text-lg font-bold text-cyan-400">{avgTemp.toFixed(1)}°C</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-blue-500/20">
                    <p className="text-xs text-gray-400 mb-1">Mínima</p>
                    <p className="text-lg font-bold text-blue-400">{minTemp.toFixed(1)}°C</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-orange-500/20">
                    <p className="text-xs text-gray-400 mb-1">Máxima</p>
                    <p className="text-lg font-bold text-orange-400">{maxTemp.toFixed(1)}°C</p>
                </div>
            </div>

            {/* Gráfico */}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historyData}>
                    <defs>
                        <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#64748b"
                        style={{ fontSize: '11px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '12px' }}
                        label={{
                            value: 'Temperatura (°C)',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fill: '#64748b', fontSize: '12px' }
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="temperature"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="url(#temperatureGradient)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Leyenda */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Temperatura actual</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-gradient-to-r from-orange-500/80 to-orange-500/10"></div>
                    <span>Tendencia histórica</span>
                </div>
            </div>
        </div>
    );
};
