import axios from "axios";


const createNewPlanetRequest = (task) => axios.post('http://localhost:3000/api/tasks',task)

const getPlanetsRequest = ()=> axios.get('http://localhost:3000/api/planet')

const getPlanetRequest = (id)=> axios.get(`http://localhost:3000/api/tasks/${id}`)
const deletePlanetRequest = (id) => axios.delete(`http://localhost:3000/api/tasks/${id}`);

const updatePlanetRequest = (planet) => axios.put(`http://localhost:3000/api/tasks/${planet}`,planet);


export { createNewPlanetRequest ,getPlanetsRequest,getPlanetRequest,deletePlanetRequest,updatePlanetRequest}