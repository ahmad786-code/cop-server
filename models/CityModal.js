import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const citySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

// Ensure a maximum of 5 cities
citySchema.statics.addCity = async function (cityData) {
    const cityCount = await this.countDocuments();

    if (cityCount >= 5) {
        throw new Error('Cannot add more than 5 cities');
    }

    return this.create(cityData);
};

const City = mongoose.model('City', citySchema);

export default City;
