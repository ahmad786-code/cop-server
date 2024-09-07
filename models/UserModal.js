import mongoose from 'mongoose'
import { genSalt, hash } from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
   username: { type: String, unique: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   image: { type: String, default: '' },
   city: { type: String },
   bio: { type: String, default: '' }, 
   createdAt: { type: Date, default: Date.now },
   participatedConcerts: [{
     concert: { type: Schema.Types.ObjectId, ref: 'Concert' },
     image: { type: String }
   }],
   rank: { type: Number, default: 0 },
   isParticipated: { type: Boolean, default: false },
   followers:[{type:mongoose.Schema.Types.ObjectId, ref:'Users'}],
   following:[{type:mongoose.Schema.Types.ObjectId, ref:'Users'}],
 });

userSchema.pre('save', async function (next) {
   const salt = await genSalt()
   this.password = await hash(this.password, salt)
   next()

});

const User = mongoose.model('Users', userSchema);

export default User
