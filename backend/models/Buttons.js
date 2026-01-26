import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    email:String,
    video:String,
    channel:String,
    liked:String,
    saved:String,
    subscribed:String
});

export const Buttons = mongoose.model('Buttons', blogSchema)