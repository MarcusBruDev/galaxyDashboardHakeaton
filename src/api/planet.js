import axios from "axios";

// API Base URL - Server endpoint
// Use localhost when running backend locally, or change to remote IP if needed
const API_URL = 'http://localhost:3000/api/planet';

const createNewPlanetRequest = (planet) => axios.post(API_URL, planet);

const getPlanetsRequest = () => axios.get(API_URL);

const getPlanetRequest = (id) => axios.get(`${API_URL}/${id}`);

const deletePlanetRequest = (id) => axios.delete(`${API_URL}/${id}`);

const updatePlanetRequest = (id, planet) => axios.put(`${API_URL}/${id}`, planet);

const getPlanetHistoriesRequest = () => axios.get('http://localhost:3000/api/planet/histories');

export {
  createNewPlanetRequest,
  getPlanetsRequest,
  getPlanetRequest,
  deletePlanetRequest,
  updatePlanetRequest,
  getPlanetHistoriesRequest
};