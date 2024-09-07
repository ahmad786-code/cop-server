import { Router } from "express";
import { login, signup ,getUserInfo, updateProfile, addProfileImage,followOrUnfollow, getAllUsers} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router()

const upload = multer({dest: "uploads/profiles/"})

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.get('/user-info', verifyToken, getUserInfo) 
authRoutes.post('/update-profile', verifyToken, updateProfile) 
authRoutes.post('/add-profile-image', verifyToken, upload.single("profile-image"), addProfileImage) 
authRoutes.post('/followorunfollow/:id', verifyToken, followOrUnfollow)
authRoutes.get('/all-users', getAllUsers);

export default authRoutes