import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRoutes.js'
import setUpSoket from './socket.js'
import articleRoutes from './routes/articleRoutes.js' 
import ConcertRoutes from './routes/ConcertRoutes.js' 
import cityRoutes from './routes/CityRoutes.js';
import participationRoutes from './routes/ParticipationRoutes.js';
dotenv.config()

const app = express()
const port = process.env.PORT | 4000
const databaseURL  =  process.env.DATABASE_URL
app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET","POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}))

app.use("/uploads/profiles", express.static("uploads/profiles") )

app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api', articleRoutes); 
app.use('/api', ConcertRoutes); 
app.use('/api/participation', participationRoutes);
app.use('/api', cityRoutes); 
const server = app.listen(port, () => {
console.log(`server runn`);

})
setUpSoket(server)
 
mongoose.connect(databaseURL)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('Connection error:', err);
    });