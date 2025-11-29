import Planet from "../models/planet.model.js"
import { PlanetHistory } from "../models/planetHistory.model.js";




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
