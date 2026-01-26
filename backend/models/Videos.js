import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    email:String,
    title:String,
    desc:String,
    thumbnail:String,
    logo:String,
    channel:String,
    Date:String,
    video:String,
    duration:String,
    like:String,
    visibility:String
});

export const Videos = mongoose.model('Videos', blogSchema)