import express from 'express';
import {
  createConcert,
  getAllConcerts,
  getConcertById,
  updateConcert,
  deleteConcert
} from '../controllers/ConcertController.js';
 
 
const router = express.Router();
 

// Create a new concert
router.post('/concerts', createConcert);

// Get all concerts
router.get('/concerts', getAllConcerts);

// Get concert by ID
router.get('/concerts/:id', getConcertById);

// Update concert by ID
router.put('/concerts/:id', updateConcert);

// Delete concert by ID
router.delete('/concerts/:id', deleteConcert);
 
export default router;
