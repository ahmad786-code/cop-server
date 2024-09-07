import City from '../models/CityModal.js';

// Get all cities
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 

// Create a new city
export const createCity = async (req, res) => {
  try {
    const newCity = await City.addCity(req.body);
    res.status(201).json(newCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a city
export const updateCity = async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCity) return res.status(404).json({ message: 'City not found' });
    res.status(200).json(updatedCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a city
export const deleteCity = async (req, res) => {
  try {
    const deletedCity = await City.findByIdAndDelete(req.params.id);
    if (!deletedCity) return res.status(404).json({ message: 'City not found' });
    res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
