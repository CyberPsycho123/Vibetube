import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    email:String,
    channel:String,
    logo:String,
    subscribers:String
});

export const Channels = mongoose.model('Channels', blogSchema)