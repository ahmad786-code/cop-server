import express from 'express';
import { getAllCities, createCity, updateCity, deleteCity } from '../controllers/CityController.js';

const router = express.Router();

router.get('/city', getAllCities);
router.post('/city', createCity);
router.put('/city/:id', updateCity);
router.delete('/city/:id', deleteCity);

export default router;
