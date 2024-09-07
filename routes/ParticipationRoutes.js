// routes/concertRoutes.js
import express from 'express';
import multer from 'multer';
import { participateInConcert } from '../controllers/ParticipationController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/participants/' });

router.post('/:userId/:concertId/participate', upload.single('image'), participateInConcert);

export default router;
