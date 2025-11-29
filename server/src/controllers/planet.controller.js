import Planet from "../models/planet.model.js"
import { PlanetHistory } from "../models/planet.model.js";




export const getPlanet = async (req, res) => {
  try {
    const planets = await Planet.find();
    res.json(planets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo planetas" });
  }
};




export const createPlanet = async (req, res) => {
  try {
    const {
      name,
      description,
      global_resources,
      population,
      environment,
      colonies,
      events
    } = req.body;

    // Crear nueva instancia del planeta
    const newPlanet = new Planet({
      name,
      description,
      global_resources,
      population,
      environment,
      colonies,
      events
    });

    const savedPlanet = await newPlanet.save();

    return res.status(201).json({
      message: "Planet created successfully",
      planet: savedPlanet
    });

  } catch (error) {
    console.error("Error creating planet:", error);

    return res.status(500).json({
      message: "Failed to create planet",
      error: error.message
    });
  }
};


// Obtener todos los PlanetHistory
export const getPlanetHistories = async (req, res) => {
  try {
    const histories = await PlanetHistory.find();
    res.json(histories);
  } catch (error) {
    console.error("Error fetching planet histories:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener el historial del planeta"
    });
  }
};


// export const updatePlanet = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body; // Lo que envía el frontend

//     // 1. Obtener el estado previo del planeta
//     const previousPlanet = await Planet.findById(id);


//     if (!previousPlanet) {
//       return res.status(404).json({ message: "Planet not found" });
//     }

//     // 2. Actualizar el planeta
//     const updatedPlanet = await Planet.findByIdAndUpdate(
//       id,
//       updates,
//       { new: true } // ← devuelve el planeta actualizado
//     );

//     // 3. Guardar en histórico
//     await PlanetHistory.create({
//       planet_id: id,
//       changes: updates,
//       previous_data: previousPlanet,
//       new_data: updatedPlanet
//     });

//     return res.json({
//       message: "Planet updated",
//       planet: updatedPlanet
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error updating planet",
//       error: error.message
//     });
//   }
// };


/**
 * Obtiene alertas y advertencias basadas en validaciones del estado del planeta
 * @route GET /status
 * @returns {Array} Array de alertas con mensaje, valor y severidad
 */
export const getAdvertices = async (req, res) => {
  try {
    const planet = await Planet.findOne();

    if (!planet) {
      return res.status(404).json({
        message: "No se encontró ningún planeta",
        alerts: []
      });
    }

    const alerts = [];

    // ============================================================================
    // VALIDACIONES DE RECURSOS GLOBALES
    // ============================================================================

    const { global_resources } = planet;

    // Agua crítica (< 50,000)
    if (global_resources.water < 50000) {
      alerts.push({
        type: "resource",
        severity: global_resources.water < 20000 ? "critical" : "warning",
        message: "Nivel de agua crítico. Se requiere producción urgente.",
        resource: "water",
        currentValue: global_resources.water,
        threshold: 50000
      });
    }

    // Oxígeno bajo (< 40,000)
    if (global_resources.oxygen < 40000) {
      alerts.push({
        type: "resource",
        severity: global_resources.oxygen < 15000 ? "critical" : "warning",
        message: "Reservas de oxígeno bajas. Riesgo para la población.",
        resource: "oxygen",
        currentValue: global_resources.oxygen,
        threshold: 40000
      });
    }

    // Energía insuficiente (< 60,000)
    if (global_resources.energy < 60000) {
      alerts.push({
        type: "resource",
        severity: global_resources.energy < 30000 ? "critical" : "warning",
        message: "Energía insuficiente. Sistemas en riesgo de apagado.",
        resource: "energy",
        currentValue: global_resources.energy,
        threshold: 60000
      });
    }

    // Comida escasa (< 30,000)
    if (global_resources.food < 30000) {
      alerts.push({
        type: "resource",
        severity: global_resources.food < 10000 ? "critical" : "warning",
        message: "Reservas de comida bajas. Riesgo de hambruna.",
        resource: "food",
        currentValue: global_resources.food,
        threshold: 30000
      });
    }

    // Minerales bajos (< 100,000)
    if (global_resources.minerals < 100000) {
      alerts.push({
        type: "resource",
        severity: global_resources.minerals < 50000 ? "critical" : "warning",
        message: "Minerales escasos. Construcción y reparaciones limitadas.",
        resource: "minerals",
        currentValue: global_resources.minerals,
        threshold: 100000
      });
    }

    // ============================================================================
    // VALIDACIONES DE AMBIENTE
    // ============================================================================

    const { environment } = planet;

    // Temperatura extrema
    if (environment.temperature < -50 || environment.temperature > 10) {
      alerts.push({
        type: "environment",
        severity: environment.temperature < -60 || environment.temperature > 20 ? "critical" : "warning",
        message: `Temperatura extrema detectada: ${environment.temperature.toFixed(1)}°C`,
        parameter: "temperature",
        currentValue: environment.temperature,
        safeRange: { min: -50, max: 10 }
      });
    }

    // Radiación alta
    if (environment.radiation_level === "high") {
      alerts.push({
        type: "environment",
        severity: "warning",
        message: "Nivel de radiación elevado. Limitar actividades exteriores.",
        parameter: "radiation",
        currentValue: environment.radiation_level,
        safeValue: "low"
      });
    }

    // Oxígeno atmosférico muy bajo (< 0.1%)
    if (environment.atmosphere.oxygen < 0.1) {
      alerts.push({
        type: "environment",
        severity: "critical",
        message: "Oxígeno atmosférico crítico. Dependencia total de sistemas de soporte.",
        parameter: "atmospheric_oxygen",
        currentValue: environment.atmosphere.oxygen,
        threshold: 0.1
      });
    }

    // ============================================================================
    // VALIDACIONES DE COLONIAS
    // ============================================================================

    if (planet.colonies && planet.colonies.length > 0) {
      planet.colonies.forEach((colony, index) => {

        // Producción de energía muy baja (< 200/min)
        if (colony.production.energy_per_min < 200) {
          alerts.push({
            type: "production",
            severity: colony.production.energy_per_min < 100 ? "critical" : "warning",
            message: `Colonia "${colony.name}": Producción de energía muy baja`,
            colony: colony.name,
            colonyId: colony.id,
            resource: "energy",
            currentValue: colony.production.energy_per_min,
            threshold: 200
          });
        }

        // Producción de agua baja (< 60/min)
        if (colony.production.water_per_min < 60) {
          alerts.push({
            type: "production",
            severity: "warning",
            message: `Colonia "${colony.name}": Producción de agua insuficiente`,
            colony: colony.name,
            colonyId: colony.id,
            resource: "water",
            currentValue: colony.production.water_per_min,
            threshold: 60
          });
        }

        // Producción de oxígeno baja (< 40/min)
        if (colony.production.oxygen_per_min < 40) {
          alerts.push({
            type: "production",
            severity: "warning",
            message: `Colonia "${colony.name}": Producción de oxígeno baja`,
            colony: colony.name,
            colonyId: colony.id,
            resource: "oxygen",
            currentValue: colony.production.oxygen_per_min,
            threshold: 40
          });
        }

        // Almacenamiento de energía crítico (< 10,000)
        if (colony.storage.energy < 10000) {
          alerts.push({
            type: "storage",
            severity: colony.storage.energy < 5000 ? "critical" : "warning",
            message: `Colonia "${colony.name}": Almacenamiento de energía crítico`,
            colony: colony.name,
            colonyId: colony.id,
            resource: "energy",
            currentValue: colony.storage.energy,
            threshold: 10000
          });
        }

        // Almacenamiento de comida bajo (< 3,000)
        if (colony.storage.food < 3000) {
          alerts.push({
            type: "storage",
            severity: colony.storage.food < 1000 ? "critical" : "warning",
            message: `Colonia "${colony.name}": Reservas de comida bajas`,
            colony: colony.name,
            colonyId: colony.id,
            resource: "food",
            currentValue: colony.storage.food,
            threshold: 3000
          });
        }

        // Población alta vs recursos (ratio crítico)
        const totalProduction =
          colony.production.water_per_min +
          colony.production.oxygen_per_min +
          colony.production.food_per_min;

        const productionPerCapita = totalProduction / colony.population;

        if (productionPerCapita < 0.05) {
          alerts.push({
            type: "population",
            severity: productionPerCapita < 0.03 ? "critical" : "warning",
            message: `Colonia "${colony.name}": Producción insuficiente para la población`,
            colony: colony.name,
            colonyId: colony.id,
            population: colony.population,
            productionPerCapita: productionPerCapita.toFixed(4),
            threshold: 0.05
          });
        }
      });
    }

    // ============================================================================
    // VALIDACIONES DE EVENTOS ACTIVOS
    // ============================================================================

    if (planet.events && planet.events.length > 0) {
      const activeEvents = planet.events.filter(e => e.active);

      activeEvents.forEach(event => {
        let severity = "info";
        let message = event.description;

        // Asignar severidad según tipo de evento
        switch (event.type) {
          case "solar_storm":
            severity = "warning";
            message = `Tormenta solar activa: ${event.description}`;
            break;
          case "low_temperature":
            severity = "warning";
            message = `Alerta de temperatura: ${event.description}`;
            break;
          case "dust_storm":
            severity = "critical";
            message = `Tormenta de polvo: ${event.description}`;
            break;
          default:
            severity = "info";
        }

        alerts.push({
          type: "event",
          severity: severity,
          message: message,
          eventType: event.type,
          eventId: event.id,
          description: event.description
        });
      });
    }

    // ============================================================================
    // VALIDACIÓN DE POBLACIÓN TOTAL
    // ============================================================================

    const totalColonyPopulation = planet.colonies?.reduce((sum, col) => sum + col.population, 0) || 0;

    if (totalColonyPopulation !== planet.population) {
      alerts.push({
        type: "data_integrity",
        severity: "warning",
        message: "Discrepancia en conteo de población total vs colonias",
        totalPopulation: planet.population,
        colonyPopulation: totalColonyPopulation,
        difference: Math.abs(planet.population - totalColonyPopulation)
      });
    }

    // ============================================================================
    // RESPUESTA
    // ============================================================================

    // Ordenar alertas por severidad (critical > warning > info)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return res.json({
      planetName: planet.name,
      timestamp: new Date().toISOString(),
      totalAlerts: alerts.length,
      criticalCount: alerts.filter(a => a.severity === "critical").length,
      warningCount: alerts.filter(a => a.severity === "warning").length,
      infoCount: alerts.filter(a => a.severity === "info").length,
      alerts: alerts
    });

  } catch (error) {
    console.error("Error obteniendo advertencias:", error);
    res.status(500).json({
      message: "Error obteniendo advertencias del planeta",
      error: error.message
    });
  }
};