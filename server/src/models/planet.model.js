import mongoose from "mongoose";

const AtmosphereSchema = new mongoose.Schema({
  co2: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  argon: { type: Number, required: true },
  oxygen: { type: Number, required: true }
}, { _id: false });

const EnvironmentSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  radiation_level: { type: String, required: true },
  atmosphere: { type: AtmosphereSchema, required: true }
}, { _id: false });

const GlobalResourcesSchema = new mongoose.Schema({
  water: { type: Number, required: true },
  oxygen: { type: Number, required: true },
  energy: { type: Number, required: true },
  food: { type: Number, required: true },
  minerals: { type: Number, required: true }
}, { _id: false });

const ProductionSchema = new mongoose.Schema({
  energy_per_min: { type: Number, required: true },
  water_per_min: { type: Number, required: true },
  oxygen_per_min: { type: Number, required: true },
  food_per_min: { type: Number, required: true },
  minerals_per_min: { type: Number, required: true }
}, { _id: false });

const StorageSchema = new mongoose.Schema({
  water: { type: Number, required: true },
  oxygen: { type: Number, required: true },
  energy: { type: Number, required: true },
  food: { type: Number, required: true },
  minerals: { type: Number, required: true }
}, { _id: false });

const ColonySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  population: { type: Number, required: true },
  production: { type: ProductionSchema, required: true },
  storage: { type: StorageSchema, required: true }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: false }
}, { _id: false });

const PlanetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  global_resources: { type: GlobalResourcesSchema, required: true },
  population: { type: Number, required: true },
  environment: { type: EnvironmentSchema, required: true },

  colonies: { type: [ColonySchema], required: true },
  events: { type: [EventSchema], required: true }

}, {
  timestamps: true // createdAt, updatedAt
});


/**/


export default mongoose.model("Planet", PlanetSchema);
export const PlanetHistory = mongoose.model("PlanetHistory", PlanetHistoriesSchema);