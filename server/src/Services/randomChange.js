import cron from 'node-cron';

// Recibe la colección como parámetro para poder operar sobre ella
const randomChange = (coleccion) => {

    cron.schedule("*/10 * * * * *", async () => {
        console.log("Ejecutando tarea automática...");

        try {
            // Obtenemos todos los documentos
            // Asumimos que coleccion es un modelo de Mongoose o una colección de MongoDB
            let docs = await coleccion.find({});

            // Si es un cursor (driver nativo), lo convertimos a array
            if (typeof docs.toArray === 'function') {
                docs = await docs.toArray();
            }

            const updates = docs.map(async (doc) => {
                let modified = false;

                // 1. Cambios continuos en Temperatura (Random Walk)
                if (doc.environment && doc.environment.temperature !== undefined) {
                    // Cambio pequeño aleatorio entre -0.5 y 0.5 grados
                    const change = (Math.random() - 0.5);
                    doc.environment.temperature += change;
                    // Redondear a 2 decimales
                    doc.environment.temperature = Math.round(doc.environment.temperature * 100) / 100;
                    modified = true;
                }

                // 2. Fluctuaciones en Recursos Globales
                if (doc.global_resources) {
                    for (const [key, value] of Object.entries(doc.global_resources)) {
                        if (typeof value === 'number') {
                            // Fluctuación de +/- 0.5%
                            const fluctuation = 1 + (Math.random() - 0.5) * 0.01;
                            doc.global_resources[key] = Math.floor(value * fluctuation);
                            modified = true;
                        }
                    }
                }

                // 3. Fluctuaciones en Almacenamiento de Colonias
                if (doc.colonies && Array.isArray(doc.colonies)) {
                    doc.colonies.forEach(colony => {
                        if (colony.storage) {
                            for (const [key, value] of Object.entries(colony.storage)) {
                                if (typeof value === 'number') {
                                    // Fluctuación de +/- 1%
                                    const fluctuation = 1 + (Math.random() - 0.5) * 0.02;
                                    colony.storage[key] = Math.floor(value * fluctuation);
                                    modified = true;
                                }
                            }
                        }
                    });
                    modified = true;
                }

                if (modified) {
                    // Guardar los cambios
                    if (typeof doc.save === 'function') {
                        // Si es documento Mongoose
                        await doc.save();
                    } else {
                        // Si es driver nativo, actualizamos explícitamente
                        await coleccion.updateOne(
                            { _id: doc._id },
                            {
                                $set: {
                                    environment: doc.environment,
                                    global_resources: doc.global_resources,
                                    colonies: doc.colonies,
                                    actualizadoEn: new Date()
                                }
                            }
                        );
                    }
                }
            });

            await Promise.all(updates);
            console.log("Datos actualizados correctamente");

        } catch (err) {
            console.error("Error actualizando datos:", err);
        }
    });
}

export default randomChange;