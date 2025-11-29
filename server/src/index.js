import  app  from './app.js';
import { connectDB } from './db.js'
import { startPlanetCron } from "./Services/randomChange.js";

await connectDB();

startPlanetCron(); // se ejecuta cada 10 segundos sin bloquear la app

app.listen(3000)

console.log('Server is running on port 3000')
