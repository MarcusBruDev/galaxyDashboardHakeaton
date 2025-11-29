import cron from "node-cron";
import Planet, { PlanetHistory } from "../models/planet.model.js";
import mongoose from "mongoose";

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const UPDATE_INTERVAL_SECONDS = 10;
const TIME_RATIO = UPDATE_INTERVAL_SECONDS / 60; // Conversión a minutos

const RADIATION_LEVELS = ["low", "medium", "high"];

const DEFAULT_ENVIRONMENT = {
    temperature: -32,
    radiation_level: "medium",
    atmosphere: {
        co2: 95.32,
        nitrogen: 2.7,
        argon: 1.6,
        oxygen: 0.13
    }
};

const DEFAULT_GLOBAL_RESOURCES = {
    water: 120000,
    oxygen: 85000,
    energy: 150000,
    food: 60000,
    minerals: 300000
};

// Factores de consumo por población (por segundo)
const COLONY_CONSUMPTION_RATES = {
    water: 0.1,
    oxygen: 0.08,
    energy: 0.15,
    food: 0.05
};

const GLOBAL_CONSUMPTION_RATES = {
    water: 0.05,
    oxygen: 0.04,
    energy: 0.08,
    food: 0.03
};

// ============================================================================
// HELPERS DE VARIACIÓN
// ============================================================================

/**
 * Aplica una variación aleatoria a un valor numérico
 * @param {number} value - Valor original
 * @param {number} variation - Porcentaje de variación (0.05 = ±5%)
 * @returns {number} Valor con variación aplicada
 */
function randomVariation(value, variation = 0.05) {
    const factor = 1 + (Math.random() * 2 - 1) * variation;
    return Number((value * factor).toFixed(2));
}

/**
 * Aplica variación aleatoria a todos los valores de un objeto
 * @param {Object} obj - Objeto con valores numéricos
 * @param {number} variation - Porcentaje de variación
 * @returns {Object} Nuevo objeto con valores variados
 */
function varyObject(obj, variation = 0.05) {
    const newObj = {};
    for (const key in obj) {
        if (typeof obj[key] === 'number') {
            newObj[key] = randomVariation(obj[key], variation);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

// ============================================================================
// GESTIÓN DE EVENTOS
// ============================================================================

/**
 * Analiza eventos activos y retorna modificadores aplicables
 * @param {Array} events - Array de eventos del planeta
 * @returns {Object} Objeto con modificadores de eventos
 */
function getEventModifiers(events) {
    const activeEvents = events?.filter(e => e.active) || [];

    const modifiers = {
        energyMultiplier: 1.0,
        temperatureOffset: 0,
        activeEventTypes: []
    };

    activeEvents.forEach(event => {
        modifiers.activeEventTypes.push(event.type);

        switch (event.type) {
            case "solar_storm":
                modifiers.energyMultiplier = 0.7; // -30% energía
                break;
            case "low_temperature":
                modifiers.temperatureOffset = -5; // -5°C
                break;
            case "dust_storm":
                modifiers.energyMultiplier *= 0.85; // -15% energía adicional
                break;
            // Agregar más tipos de eventos según sea necesario
        }
    });

    return modifiers;
}

// ============================================================================
// ACTUALIZACIÓN DE AMBIENTE (Environment)
// ============================================================================

/**
 * Actualiza los parámetros ambientales del planeta
 * @param {Object} environment - Objeto environment del planeta
 * @param {Object} modifiers - Modificadores de eventos
 */
function updateEnvironment(environment, modifiers) {
    // Temperatura con variación natural + efectos de eventos
    environment.temperature = randomVariation(
        environment.temperature + modifiers.temperatureOffset,
        0.05
    );

    // Nivel de radiación (10% probabilidad de cambio)
    if (Math.random() < 0.1) {
        const currentIndex = RADIATION_LEVELS.indexOf(environment.radiation_level);
        const change = Math.random() < 0.5 ? -1 : 1;
        const newIndex = Math.max(0, Math.min(RADIATION_LEVELS.length - 1, currentIndex + change));
        environment.radiation_level = RADIATION_LEVELS[newIndex];
    }

    // Atmósfera con variación mínima
    environment.atmosphere = varyObject(environment.atmosphere, 0.02);
}

// ============================================================================
// ACTUALIZACIÓN DE COLONIAS
// ============================================================================

/**
 * Procesa la producción de recursos de una colonia
 * @param {Object} colony - Objeto colonia
 * @param {number} energyMultiplier - Multiplicador de energía por eventos
 * @returns {Object} Recursos producidos para transferir al global
 */
function processColonyProduction(colony, energyMultiplier) {
    const produced = {
        water: 0,
        oxygen: 0,
        energy: 0,
        food: 0,
        minerals: 0
    };

    // Calcular producción y agregar al storage de la colonia
    colony.storage.water += Math.round(colony.production.water_per_min * TIME_RATIO);
    colony.storage.oxygen += Math.round(colony.production.oxygen_per_min * TIME_RATIO);
    colony.storage.energy += Math.round(colony.production.energy_per_min * TIME_RATIO * energyMultiplier);
    colony.storage.food += Math.round(colony.production.food_per_min * TIME_RATIO);
    colony.storage.minerals += Math.round(colony.production.minerals_per_min * TIME_RATIO);

    // Calcular transferencia al almacenamiento global (50% de la producción)
    produced.water = Math.round(colony.production.water_per_min * TIME_RATIO * 0.5);
    produced.oxygen = Math.round(colony.production.oxygen_per_min * TIME_RATIO * 0.5);
    produced.energy = Math.round(colony.production.energy_per_min * TIME_RATIO * energyMultiplier * 0.5);
    produced.food = Math.round(colony.production.food_per_min * TIME_RATIO * 0.5);
    produced.minerals = Math.round(colony.production.minerals_per_min * TIME_RATIO * 0.5);

    return produced;
}

/**
 * Procesa el consumo de recursos de una colonia basado en su población
 * @param {Object} colony - Objeto colonia
 */
function processColonyConsumption(colony) {
    const populationFactor = colony.population * TIME_RATIO;

    colony.storage.water = Math.max(0,
        colony.storage.water - Math.round(populationFactor * COLONY_CONSUMPTION_RATES.water)
    );
    colony.storage.oxygen = Math.max(0,
        colony.storage.oxygen - Math.round(populationFactor * COLONY_CONSUMPTION_RATES.oxygen)
    );
    colony.storage.energy = Math.max(0,
        colony.storage.energy - Math.round(populationFactor * COLONY_CONSUMPTION_RATES.energy)
    );
    colony.storage.food = Math.max(0,
        colony.storage.food - Math.round(populationFactor * COLONY_CONSUMPTION_RATES.food)
    );
}

/**
 * Varía ligeramente las tasas de producción para simular eficiencia variable
 * @param {Object} production - Objeto production de la colonia
 */
function varyProductionRates(production) {
    production.energy_per_min = Math.round(randomVariation(production.energy_per_min, 0.03));
    production.water_per_min = Math.round(randomVariation(production.water_per_min, 0.03));
    production.oxygen_per_min = Math.round(randomVariation(production.oxygen_per_min, 0.03));
    production.food_per_min = Math.round(randomVariation(production.food_per_min, 0.03));
    production.minerals_per_min = Math.round(randomVariation(production.minerals_per_min, 0.03));
}

/**
 * Actualiza todas las colonias del planeta
 * @param {Array} colonies - Array de colonias
 * @param {Object} globalResources - Recursos globales del planeta
 * @param {number} energyMultiplier - Multiplicador de energía por eventos
 */
function updateColonies(colonies, globalResources, energyMultiplier) {
    if (!colonies || !Array.isArray(colonies)) return;

    colonies.forEach(colony => {
        if (!colony.production || !colony.storage) return;

        // 1. Producir recursos
        const produced = processColonyProduction(colony, energyMultiplier);

        // 2. Transferir al almacenamiento global
        globalResources.water += produced.water;
        globalResources.oxygen += produced.oxygen;
        globalResources.energy += produced.energy;
        globalResources.food += produced.food;
        globalResources.minerals += produced.minerals;

        // 3. Consumir recursos por población
        processColonyConsumption(colony);

        // 4. Variar tasas de producción
        varyProductionRates(colony.production);
    });
}

// ============================================================================
// ACTUALIZACIÓN DE RECURSOS GLOBALES
// ============================================================================

/**
 * Procesa el consumo global de recursos basado en la población total
 * @param {Object} globalResources - Recursos globales del planeta
 * @param {number} totalPopulation - Población total del planeta
 */
function processGlobalConsumption(globalResources, totalPopulation) {
    const populationFactor = totalPopulation * TIME_RATIO;

    globalResources.water = Math.max(0,
        globalResources.water - Math.round(populationFactor * GLOBAL_CONSUMPTION_RATES.water)
    );
    globalResources.oxygen = Math.max(0,
        globalResources.oxygen - Math.round(populationFactor * GLOBAL_CONSUMPTION_RATES.oxygen)
    );
    globalResources.energy = Math.max(0,
        globalResources.energy - Math.round(populationFactor * GLOBAL_CONSUMPTION_RATES.energy)
    );
    globalResources.food = Math.max(0,
        globalResources.food - Math.round(populationFactor * GLOBAL_CONSUMPTION_RATES.food)
    );
}

// ============================================================================
// INICIALIZACIÓN DE DATOS
// ============================================================================

/**
 * Inicializa los datos del planeta si no existen
 * @param {Object} planet - Documento del planeta
 */
function initializePlanetData(planet) {
    if (!planet.environment) {
        planet.environment = { ...DEFAULT_ENVIRONMENT };
    }

    if (!planet.global_resources) {
        planet.global_resources = { ...DEFAULT_GLOBAL_RESOURCES };
    }

    if (!planet.events) {
        planet.events = [];
    }

    if (!planet.colonies) {
        planet.colonies = [];
    }
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN
// ============================================================================

/**
 * Actualiza todos los stats del planeta de forma asíncrona
 */
export const updatePlanetStats = async () => {
    try {
        const planet = await Planet.findOne().exec();

        if (!planet) {
            console.log("⚠ No se encontró ningún planeta.");
            return;
        }

        // 1. Inicializar datos si es necesario
        initializePlanetData(planet);

        // 2. Obtener modificadores de eventos activos
        const eventModifiers = getEventModifiers(planet.events);

        // 3. Actualizar ambiente
        updateEnvironment(planet.environment, eventModifiers);

        // 4. Actualizar colonias y acumular recursos globales
        updateColonies(planet.colonies, planet.global_resources, eventModifiers.energyMultiplier);

        // 5. Procesar consumo global
        processGlobalConsumption(planet.global_resources, planet.population);

        // 6. Guardar en historial
        const history = new PlanetHistory({
            name: planet.name,
            description: planet.description,
            global_resources: planet.global_resources,
            population: planet.population,
            environment: planet.environment,
            colonies: planet.colonies,
            events: planet.events
        });

        await history.save();
        await planet.save();

        // 7. Log de información
        logUpdateInfo(planet, eventModifiers);

    } catch (err) {
        console.error("❌ Error actualizando planeta:", err);
    }
};

/**
 * Registra información sobre la actualización
 * @param {Object} planet - Documento del planeta
 * @param {Object} eventModifiers - Modificadores de eventos
 */
function logUpdateInfo(planet, eventModifiers) {
    console.log("✓ Actualización automática del planeta:", new Date().toLocaleTimeString());
    console.log(`  Recursos globales: E:${planet.global_resources.energy} W:${planet.global_resources.water} O:${planet.global_resources.oxygen}`);
    console.log(`  Temperatura: ${planet.environment.temperature.toFixed(1)}°C | Radiación: ${planet.environment.radiation_level}`);

    if (eventModifiers.activeEventTypes.length > 0) {
        console.log(`  ⚠ Eventos activos: ${eventModifiers.activeEventTypes.join(", ")}`);
    }

    if (planet.colonies && planet.colonies.length > 0) {
        console.log(`  Colonias: ${planet.colonies.length} | Población total: ${planet.population}`);
    }
}

// ============================================================================
// CRON JOB
// ============================================================================

/**
 * Inicia el cron job para actualización automática del planeta
 */
export const startPlanetCron = () => {
    cron.schedule(`*/${UPDATE_INTERVAL_SECONDS} * * * * *`, () => {
        updatePlanetStats();
    });

    console.log(`⏳ Cron iniciado: actualización del planeta cada ${UPDATE_INTERVAL_SECONDS} segundos`);
};
