import express from 'express'
import { google } from 'googleapis';
import cors from 'cors'
import mongoose from 'mongoose'
import { Videos } from './models/Videos.js'
import { Buttons } from './models/Buttons.js'
import { Saved } from './models/Saved.js'
import { Channels } from './models/Channels.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.ATLAS_URL;

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express()
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json());
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})


if (!DB_URL) {
  console.error("ATLAS_URL is undefined");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Successfully connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB();

const secretKey = process.env.SECRET_KEY;


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: 'vibetube',
    resource_type: file.fieldname === 'video' ? 'video' : 'image',
    public_id: file.fieldname + '-' + Date.now(),
  }),
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // MP4 only for video
    if (file.fieldname === "video") {
      if (file.mimetype !== "video/mp4") {
        return cb(new Error("Only MP4 videos allowed"), false);
      }
    }

    // Image validation
    if (file.fieldname === "image") {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files allowed"), false);
      }
    }

    cb(null, true);
  },
});


const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
};

const getDMYDate = () => {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0"); // months start from 0
  const y = now.getFullYear();
  return `${d}-${m}-${y}`;
};






app.get('/', (req, res) => {
  res.status(200).json({ status: "ok" })
})

app.post("/uploadvideo", upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), async (req, res) => {
  try {
    const email = req.cookies.email;
    if (!email) {
      return res.status(401).json({ success: false });
    }

    const { title, desc, visibility } = req.body;
    const channels = await Channels.findOne({ email });

    if (!req.files?.image || !req.files?.video) {
      return res.status(400).json({
        success: false,
        message: "Image and MP4 video are required",
      });
    }

    const imageUrl = req.files.image[0].path;
    const videoUrl = req.files.video[0].path;

    const durationSeconds = await getVideoDuration(videoUrl);

    const formatDuration = (sec) => {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const videodoc = new Videos({
      email,
      title,
      desc,
      thumbnail: imageUrl,
      logo: channels.logo,
      channel: channels.channel,
      Date: getDMYDate(),
      video: videoUrl,
      duration: formatDuration(durationSeconds),
      like: "0",
      visibility: visibility
    });

    await videodoc.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}
);


app.post("/editvideo", upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 },]), async (req, res) => {
  try {
    const email = req.cookies.email;
    if (!email) {
      return res.status(401).json({ success: false });
    }

    const { title, desc, id, visibility } = req.body;

    const updateData = { title, desc, visibility };


    if (req.files?.image) {
      updateData.thumbnail = req.files.image[0].path;
    }

    if (req.files?.video) {
      updateData.video = req.files.video[0].path;
    }

    await Videos.updateOne(
      { email: email, _id: id },
      { $set: updateData }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
);

app.post('/videodelete', async (req, res) => {
  const { id } = req.body
  await Videos.deleteOne({ _id: id })
  await Saved.deleteMany({ video_id: id })
  await Buttons.deleteMany({ video: id })
  res.json({ success: true })
})

app.post("/videodata", async (req, res) => {
  const email = req.cookies.email;
  const { id } = req.body
  const videos = await Videos.findOne({ _id: id, email: email })
  res.json({ success: true, videos: videos })

})


app.post('/videos', async (req, res) => {
  const videos = await Videos.find({})
  res.json({ success: true, videos: videos })
})

app.post('/channel', async (req, res) => {
  const { chanel } = req.body

  const videos = await Videos.find({ channel: chanel })
  const ytchannels = await Channels.findOne({ channel: chanel })
  res.json({ success: true, videos: videos, ytchannel: ytchannels })
})


app.post('/subscribe', async (req, res) => {
  const { chanel } = req.body
  const email = req.cookies.email

  const check = await Buttons.findOne({ channel: chanel, email: email })
  if (check) {
    if (check.subscribed === "yes") {
      await Buttons.updateOne({ channel: chanel, email: email }, { $set: { subscribed: "no" } })
    }
    else {
      await Buttons.updateOne({ channel: chanel, email: email }, { $set: { subscribed: "yes" } })
    }
  }
  else {
    const subscribed = new Buttons({ email: email, channel: chanel, liked: "no", saved: "no", subscribed: "yes" })
    await subscribed.save()
  }

  const check_subscribed = await Buttons.findOne({ channel: chanel, email: email })

  if (check_subscribed) {
    const fetch_channel = await Channels.findOne({ channel: chanel, email: email })
    let subscribers = parseInt(fetch_channel.subscribers)
    if (check_subscribed.subscribed == "yes") {
      subscribers += 1
    }
    else {
      subscribers -= 1
    }
    let str_sub = String(subscribers)
    await Channels.updateOne({ channel: chanel, email: email }, { $set: { subscribers: str_sub } })
    res.json({ success: true })
  }
  else {
    res.json({ success: false })
  }
})

app.post('/readsubscribe', async (req, res) => {
  const email = req.cookies.email
  const { chanel } = req.body
  const check_subscribed = await Buttons.findOne({ channel: chanel, email: email })

  if (check_subscribed) {
    if (check_subscribed.subscribed == "yes") {
      res.json({ success: true, subscribed: true })
    }
    else {
      res.json({ success: true, subscribed: false })
    }
  }
  else {
    res.json({ success: false })
  }
})

app.post('/readlikes', async (req, res) => {
  const { chanel, id } = req.body
  const videos = await Videos.findOne({ _id: id, channel: chanel })
  if (videos) {
    const buttons = await Buttons.findOne({ video: id, channel: chanel })
    if (buttons) {
      const likes = videos.like
      const liked = buttons.liked

      if (liked == "yes") {
        res.json({ success: true, click: true, like: likes })
      }
      else {
        res.json({ success: true, click: false, like: likes })
      }
    }
    else {
      res.json({ success: true, click: false, like: likes })
    }
  }


})

app.post('/like', async (req, res) => {
  try {
    const { chanel, id } = req.body
    const email = req.cookies.email
    if (!email) return res.status(401).json({ success: false })

    let video = await Videos.findById(id)
    if (!video) return res.json({ success: false })

    let likes = parseInt(video.like || "0")

    let button = await Buttons.findOne({ email, video: id, channel: chanel })

    // CREATE BUTTON IF NOT EXISTS
    if (!button) {
      button = await Buttons.create({
        email,
        video: id,
        channel: chanel,
        liked: "yes",
        saved: "no",
        subscribed: "no"
      })
      likes += 1
    }
    else if (button.liked === "yes") {
      // UNLIKE
      await Buttons.updateOne({ _id: button._id }, { $set: { liked: "no" } })
      likes -= 1
    }
    else {
      // LIKE
      await Buttons.updateOne({ _id: button._id }, { $set: { liked: "yes" } })
      likes += 1
    }

    await Videos.updateOne(
      { _id: id },
      { $set: { like: String(likes) } }
    )

    const updated = await Buttons.findOne({ email, video: id, channel: chanel })

    res.json({
      success: true,
      like: likes,
      click: updated.liked === "yes"
    })

  } catch (err) {
    console.error("LIKE ERROR:", err)
    res.status(500).json({ success: false })
  }
})




app.post('/saved', async (req, res) => {
  try {
    const { chanel, id } = req.body
    const email = req.cookies.email
    if (!email) return res.status(401).json({ success: false })

    let button = await Buttons.findOne({ email, video: id, channel: chanel })

    // CREATE BUTTON
    if (!button) {
      await Buttons.create({
        email,
        video: id,
        channel: chanel,
        liked: "no",
        saved: "yes",
        subscribed: "no"
      })
    }
    else if (button.saved === "yes") {
      // UNSAVE
      await Buttons.updateOne({ _id: button._id }, { $set: { saved: "no" } })
      await Saved.deleteOne({ email, video_id: id })
      return res.json({ success: true, saved: false })
    }
    else {
      // SAVE
      await Buttons.updateOne({ _id: button._id }, { $set: { saved: "yes" } })
    }

    const exists = await Saved.findOne({ email, video_id: id })
    if (!exists) {
      const video = await Videos.findById(id)
      await Saved.create({
        video_id: video._id,
        email,
        title: video.title,
        desc: video.desc,
        thumbnail: video.thumbnail,
        logo: video.logo,
        channel: video.channel,
        Date: video.Date,
        video: video.video,
        duration: video.duration,
        like: video.like
      })
    }

    res.json({ success: true, saved: true })

  } catch (err) {
    console.error("SAVE ERROR:", err)
    res.status(500).json({ success: false })
  }
})

app.post('/readsaved', async (req, res) => {
  const { chanel, id } = req.body
  const email = req.cookies.email

  const button = await Buttons.findOne({ email, video: id, channel: chanel })

  res.json({
    success: true,
    saved: button?.saved === "yes"
  })
})


app.post('/savedioes', async (req, res) => {
  const email = req.cookies.email
  const saveds = await Saved.find({ email: email })
  if (saveds) {
    res.json({ success: true, saved_videos: { saveds: saveds } })
  }
  // to be continued
})


app.post('/login', async (req, res) => {
  const { authResult } = req.body
  const code = authResult.code
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'postmessage'
  );
  const googleres = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(googleres.tokens)

  const userRes = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleres.tokens.access_token}`
  )

  const { email, name, picture } = await userRes.json()


  const check_email = await Channels.findOne({ email: email })
  if (check_email) {
    const token = jwt.sign({ email: email }, secretKey, { expiresIn: '7d' });
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: true, sameSite: "none" });
    res.cookie("email", email, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: true, sameSite: "none" });
    res.json({ success: true })
  }
  else {
    const make_channel = new Channels({ email: email, channel: name, logo: picture, subscribers: "0" })
    make_channel.save()
    const token = jwt.sign({ email: email }, secretKey, { expiresIn: '7d' });
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: true, sameSite: "none" });
    res.cookie("email", email, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: true, sameSite: "none" });
    res.json({ success: true })
  }
})

app.post('/loged', async (req, res) => {
  const email = req.cookies.email
  let profile = ""
  let channel = ""
  if (email) {
    const check_email = await Channels.findOne({ email: email })
    if (check_email) {
      profile = check_email.logo
      channel = check_email.channel
    }
    res.json({ success: true, profile: profile, channel: channel })
  }
  else {
    res.json({ success: false, profile: profile, channel: channel })
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie("token", {
    secure: true,
    sameSite: "none"
  });
  res.clearCookie("email", {
    secure: true,
    sameSite: "none"
  });

  res.json({ message: "Logged out" });
});

app.post('/admin', async (req, res) => {
  const email = req.cookies.email
  const videos = await Videos.find({ email: email })
  res.json({ success: true, videos: videos })
})

app.post('/subscription', async (req, res) => {
  const email = req.cookies.email
  const subscribed = await Buttons.find({ email: email })
  let channels = []
  if (subscribed) {
    for (let i = 0; i < subscribed.length; i++) {
      if (subscribed[i].subscribed == "yes") {
        const channel = await Channels.findOne({ channel: subscribed[i].channel })
        channels.push({ name: channel.channel, avatar: channel.logo, subscribed: true })
      }
    }
    res.json({ success: true, channels: channels })
  }
})


app.post("/editchannel", upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 },]), async (req, res) => {
  try {
    const email = req.cookies.email;
    if (!email) {
      return res.status(401).json({ success: false });
    }

    const admin_channel = await Channels.findOne({ email: email })
    const previous_name = admin_channel.channel


    const { channel } = req.body;

    const updateData = { channel };

    if (req.files?.image) {
      updateData.logo = req.files.image[0].path;
    }

    let flag = false
    const all_channels = await Channels.find({})
    for (let i = 0; i < all_channels.length; i++) {
      if (all_channels[i].channel == channel) {
        flag = true
      }
    }


    if (flag) {
      res.json({ success: false, message: "This channel name is already exists" })
    }
    else {

      await Channels.updateOne(
        { email: email },
        { $set: updateData }
      );

      await Videos.updateMany(
        { email: email },
        { $set: updateData }
      );

      await Saved.updateMany(
        { channel: previous_name },
        { $set: updateData }
      )

      await Buttons.updateMany({ channel: previous_name }, { $set: { channel: channel } })

      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
);

app.post("/channeldata", async (req, res) => {
  const email = req.cookies.email;
  const channels = await Channels.findOne({ email: email })
  res.json({ success: true, channels: channels })

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

