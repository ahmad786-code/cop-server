
import User from '../models/UserModal.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {renameSync, unlinkSync} from 'fs'
import path from 'path';
const nextAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: nextAge})
}

 

export const signup = async (request, response, next) => {
    try {
        const {username, email, city, password} = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password required");
        }
        const user = await User.create({email, username, city, password});
        const token = createToken(email, user.id);

        return response.status(201).json({ 
            token,  // Return token in the response body
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                city: user.city,
                image: user.image
            }
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};


export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("Incorrect Username or Password");
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return response.status(404).send("Incorrect Password");
        }
        
        const token = createToken(email, user.id);

        return response.status(200).json({
            token,  // Return token in the response body
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                city: user.city,
                image: user.image,
                bio: user.bio
            }
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

 
export const getUserInfo = async (request, response, next) => {
    try {
      const userData = await User.findById(request.userId)
      if(!userData) {
        return response.status(404).send("User with id not found");
      }
        return response.status(200).json({ user: {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            city: userData.city,
            image: userData.image,
            bio: userData.bio,
            rank: userData.rank,
            followers: userData.followers,
            following: userData.following
        }

        })
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}


export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request; // Get userId from request
        const { username, email, password, bio, city } = request.body; // Get fields from the request body

        if (!username || !email) {
            return response.status(400).send("Username and Email are required");
        }

        // Find the user
        const userData = await User.findById(userId);
        if (!userData) {
            return response.status(404).send("User not found");
        }

        // Update username and email
        if (username) userData.username = username;
        if (email) userData.email = email;
        
        // Update bio and city if provided
        if (bio) userData.bio = bio;
        if (city) userData.city = city;

        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt();
            userData.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user data
        await userData.save();

        // Return updated user info
        return response.status(200).json({
            user: {
                id: userData.id,
                email: userData.email,
                username: userData.username,
                bio: userData.bio,
                city: userData.city,
                image: userData.image // Image remains unchanged unless updated separately
            }
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("File is required");
        }

        const date = Date.now();
        const fileExtension = path.extname(request.file.originalname);
        const fileName = `uploads/profiles/${date}${fileExtension}`;

        // Rename the file
        renameSync(request.file.path, fileName);

        // Use `findByIdAndUpdate` if `request.userId` is a string representing the user ID
        const updateUser = await User.findByIdAndUpdate(
            request.userId, // Assuming this is a valid user ID string
            { image: fileName },
            { new: true, runValidators: true }
        );

        if (!updateUser) {
            return response.status(404).send("User not found");
        }

        return response.status(200).json({
            user: {
                image: updateUser.image,
            }
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};


export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; 
        const jiskoFollowKrunga = req.params.id;  
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding password field
        const users = await User.find({}, 'username email city image bio rank following subscribers').exec();

        if (!users || users.length === 0) {
            return res.status(404).json({
                message: 'No users found',
                success: false,
            });
        }

        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};