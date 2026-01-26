import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    video_id:String,
    email:String,
    title:String,
    desc:String,
    thumbnail:String,
    logo:String,
    channel:String,
    Date:String,
    video:String,
    duration:String,
    like:String
});

export const Saved = mongoose.model('Saved', blogSchema)