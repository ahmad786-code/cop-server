import Concert from '../models/ConcertModal.js';

// Create a new concert
export const createConcert = async (req, res) => {
  try {
    const concert = await Concert.create(req.body);
    res.status(201).json(concert);
  } catch (error) {
    res.status(500).json({ error: "Failed to create concert" });
  }
};

// Get all concerts
export const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    res.status(200).json(concerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to get concerts" });
  }
};

// Get a concert by ID
export const getConcertById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) {
      return res.status(404).json({ error: "Concert not found" });
    }
    res.status(200).json(concert);
  } catch (error) {
    res.status(500).json({ error: "Failed to get concert" });
  }
};

// Update a concert by ID
export const updateConcert = async (req, res) => {
  try {
    const concert = await Concert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!concert) {
      return res.status(404).json({ error: "Concert not found" });
    }
    res.status(200).json(concert);
  } catch (error) {
    res.status(500).json({ error: "Failed to update concert" });
  }
};

// Delete a concert by ID
export const deleteConcert = async (req, res) => {
  try {
    const concert = await Concert.findByIdAndDelete(req.params.id);
    if (!concert) {
      return res.status(404).json({ error: "Concert not found" });
    }
    res.status(200).json({ message: "Concert deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete concert" });
  }
};
