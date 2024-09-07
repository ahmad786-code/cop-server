 // controllers/ParticipationController.js
import mongoose from 'mongoose'; // Ensure this import is present
import Concert from '../models/ConcertModal.js';
import User from '../models/UserModal.js';
import path from 'path';
import { renameSync } from 'fs';

export const participateInConcert = async (req, res) => {
  try {
    const { userId, concertId } = req.params;
    const { file } = req;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(concertId)) {
      return res.status(400).json({ message: 'Invalid userId or concertId format' });
    }

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Process file upload
    const { path: tempPath, originalname } = file;
    const participantImage = `uploads/participants/${Date.now()}_${originalname}`;

    // Move file from temporary to permanent location
    renameSync(tempPath, participantImage);

    // Update user participation
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the concert and user
    const concert = await Concert.findById(concertId);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    user.participatedConcerts.push({
      concert: concertId,
      image: participantImage
    });
    user.rank += 1; // Increment user rank
    user.isParticipated = true; // Set participation flag
    await user.save();

    concert.participants.push(userId);
    await concert.save();

    res.status(200).json({
      message: 'Participation successful',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
