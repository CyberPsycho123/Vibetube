# 📺 Vibetube

> Watch. Create. Upload. Your channel, your stage.

**Vibetube** is a full-stack YouTube-inspired video sharing platform. Users can watch videos from any channel, and by signing in with Google they get their own channel — where they can upload, manage, and share videos with the community. Built with a JavaScript/CSS frontend and a Node.js/Express backend, with videos stored on Cloudinary and data on MongoDB Atlas.

🔗 **Live Demo:** [vibetube-omega.vercel.app](https://vibetube-omega.vercel.app)

---

## 🚀 Features

- 🎬 **Watch Videos** — Browse and stream all public videos on the platform
- 🔐 **Google OAuth Login** — Sign in instantly with your Google account — no passwords needed
- 📡 **Auto Channel Creation** — A channel is automatically created for you on first login using your Google name and profile picture
- 📤 **Upload Videos** — Upload MP4 videos with a custom thumbnail, title, description, and visibility setting
- ✏️ **Edit & Delete Videos** — Manage your uploaded content from your creator dashboard
- 👤 **Edit Your Channel** — Update your channel name and logo anytime
- ❤️ **Like Videos** — Like and unlike videos; like counts update in real time
- 🔔 **Subscribe to Channels** — Subscribe/unsubscribe with live subscriber count updates
- 🔖 **Save Videos** — Save videos to your personal saved list to watch later
- 📋 **Subscriptions Feed** — View all channels you're subscribed to in one place
- 🕒 **Auto Duration Detection** — Video duration is automatically extracted using FFmpeg on upload
- 🌐 **Deployed on Vercel** — Always live, no setup needed for end users

---

## 🛠️ Tech Stack

| Layer            | Technology                        |
|------------------|-----------------------------------|
| Frontend         | React.js, CSS3                    |
| Backend          | Node.js, Express.js               |
| Database         | MongoDB Atlas (Mongoose)          |
| Authentication   | Google OAuth 2.0 + JWT (cookies)  |
| File Storage     | Cloudinary (videos & images)      |
| Video Processing | FFmpeg (fluent-ffmpeg)            |
| File Uploads     | Multer + multer-storage-cloudinary|
| Hosting          | Vercel                            |

---

## 📁 Project Structure

```
Vibetube/
├── backend/
│   ├── models/
│   │   ├── Videos.js      # Video metadata schema
│   │   ├── Channels.js    # Channel & user schema
│   │   ├── Buttons.js     # Like, save, subscribe state per user
│   │   └── Saved.js       # Saved videos per user
│   └── server.js           # Express server & all API routes
└── frontend/              # Client-side UI — video feed, player, channel & upload pages
```

---

## 🧭 How It Works

```
User (Browser)
     │
     │  Google OAuth Login
     ▼
┌─────────────────────────────────────────────────┐
│                Express Backend                  │
│                                                 │
│  ┌──────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  Google  │  │ Cloudinary│  │  MongoDB    │  │
│  │ OAuth2   │  │ (videos & │  │  Atlas      │  │
│  │ + JWT    │  │  images)  │  │  (data)     │  │
│  └──────────┘  └───────────┘  └─────────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  FFmpeg — auto video duration detection │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
     │
     ▼
  Frontend (Vercel)
```

1. User signs in via **Google OAuth**. A JWT is issued and stored in a secure HTTP-only cookie.
2. On first login, a **channel is automatically created** using their Google name and profile picture.
3. Creators upload MP4 videos + thumbnails — files go to **Cloudinary**, metadata to **MongoDB**.
4. **FFmpeg** auto-detects and stores the video duration on upload.
5. Viewers can **like**, **save**, and **subscribe** — all states are tracked per user in the database.

---

## 🔌 API Endpoints

| Method | Endpoint         | Description                              |
|--------|------------------|------------------------------------------|
| POST   | `/login`         | Google OAuth login, sets JWT cookie      |
| POST   | `/logout`        | Clears auth cookies                      |
| POST   | `/loged`         | Check login status & get profile info    |
| POST   | `/videos`        | Fetch all videos                         |
| POST   | `/channel`       | Fetch a channel's videos & info          |
| POST   | `/uploadvideo`   | Upload a new video (MP4 + thumbnail)     |
| POST   | `/editvideo`     | Edit video title, desc, thumbnail        |
| POST   | `/videodelete`   | Delete a video and its related data      |
| POST   | `/videodata`     | Get a single video's data (owner only)   |
| POST   | `/like`          | Toggle like on a video                   |
| POST   | `/readlikes`     | Get like count & liked state             |
| POST   | `/subscribe`     | Toggle subscription to a channel         |
| POST   | `/readsubscribe` | Check subscription state                 |
| POST   | `/saved`         | Toggle save on a video                   |
| POST   | `/readsaved`     | Check if a video is saved                |
| POST   | `/savedioes`     | Fetch all saved videos for current user  |
| POST   | `/admin`         | Fetch all videos uploaded by current user|
| POST   | `/subscription`  | Fetch all subscribed channels            |
| POST   | `/editchannel`   | Update channel name and/or logo          |
| POST   | `/channeldata`   | Get current user's channel info          |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Cloudinary](https://cloudinary.com/) account
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth 2.0 credentials

### 1. Clone the Repository

```bash
git clone https://github.com/CyberPsycho123/Vibetube.git
cd Vibetube
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
ATLAS_URL=your_mongodb_atlas_connection_string
SECRET_KEY=your_jwt_secret_key

# Google OAuth
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

PORT=3000
```

Then start the server:

```bash
npm start
```

The backend will run at `http://localhost:3000`.

### 3. Set Up the Frontend

```bash
cd ../frontend
npx serve .
```

> Update the API base URL in the frontend source to point to `http://localhost:3000` for local development.

---

## 🔑 Where to Get Your API Keys

| Service        | Link                                                                 |
|----------------|----------------------------------------------------------------------|
| MongoDB Atlas  | [cloud.mongodb.com](https://cloud.mongodb.com)                       |
| Google OAuth   | [console.cloud.google.com](https://console.cloud.google.com)        |
| Cloudinary     | [cloudinary.com](https://cloudinary.com)                            |

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

---

## 🌍 Deployment

The project is deployed on **Vercel**. To deploy your own fork:

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and import your fork
3. Deploy `frontend/` as the main site
4. Deploy `backend/` separately on Vercel (serverless), [Render](https://render.com), or [Railway](https://railway.app)
5. Add all `.env` variables to your hosting platform's environment settings

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project does not currently specify a license. Please contact the author before using it in production or redistributing.

---

## 👤 Author

**CyberPsycho123**
- GitHub: [@CyberPsycho123](https://github.com/CyberPsycho123)

---

> 🎥 **Vision:** Vibetube is built on the idea that anyone should be able to watch and share videos online — a simple, open platform where creators and viewers come together.
