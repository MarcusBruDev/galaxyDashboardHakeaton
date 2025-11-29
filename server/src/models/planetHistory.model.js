import mongoose from "mongoose";

const PlanetHistorySchema = new mongoose.Schema({
  planet_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Planet" },
  changes: { type: Object, required: true },      // Solo los campos actualizados
  previous_data: { type: Object, required: true }, // Estado antes del cambio
  new_data: { type: Object, required: true },      // Estado después del cambio
  updated_at: { type: Date, default: Date.now }
});

export const PlanetHistory = mongoose.model("PlanetHistory", PlanetHistorySchema);