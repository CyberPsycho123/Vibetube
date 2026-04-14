# 📺 Vibetube

> Watch. Create. Upload. Your channel, your stage.

**Vibetube** is a full-stack video sharing platform inspired by YouTube. Users can watch videos from any channel on the platform, and by creating their own channel, they can upload and share their own videos with the world. Built with a JavaScript/CSS frontend and a Node.js backend, deployed live on Vercel.

🔗 **Live Demo:** [vibetube-omega.vercel.app](https://vibetube-omega.vercel.app)

---

## 🚀 Features

- 🎬 **Watch Videos** — Browse and stream videos uploaded by creators on the platform
- 📡 **Create a Channel** — Register your own channel and become a creator in seconds
- 📤 **Upload Videos** — Share your content with the Vibetube community via your channel
- 👤 **Creator & Viewer Roles** — Seamlessly use the platform as both a viewer and a content creator
- ⚡ **Lightweight & Fast** — Clean UI built with vanilla JavaScript and CSS
- 🌐 **Deployed on Vercel and Render** — Always live, no setup needed for end users

---

## 🛠️ Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | React.js, CSS3        |
| Backend   | Node.js,Express.js    |
| Hosting   | Vercel,Render         |

---

## 📁 Project Structure

```
Vibetube/
├── backend/       # Server-side logic — video storage, channel management, APIs
└── frontend/      # Client-side UI — video feed, player, channel & upload pages
```

---

## 🧭 How It Works

```
         ┌───────────────────────────────┐
         │            Vibetube           │
         └───────────────┬───────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
   👀 Viewer Mode               🎙️ Creator Mode
   Browse & watch              Create channel
      videos                   & upload videos
          │                             │
          └──────────────┬──────────────┘
                         │
                Backend / Node.js API
         (video data, channels, uploads)
```

1. **Viewers** land on the homepage, browse the video feed, and watch content from any channel.
2. **Creators** register a channel, then use the upload page to publish their videos.
3. The **backend** handles all video metadata, channel data, and serves content to the frontend.

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/CyberPsycho123/Vibetube.git
cd Vibetube
```

### 2. Set Up the Backend

```bash
cd backend
npm install
npm start
```

The backend server will start locally (default: `http://localhost:3000`).

### 3. Set Up the Frontend

```bash
cd ../frontend
# Open index.html in your browser, or serve with:
npx serve .
```

> If the frontend makes API calls to the backend, update the base URL in the frontend source to point to your local backend (`http://localhost:3000`).

---

## 🌍 Deployment

The project is deployed on **Vercel**. To deploy your own fork:

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and import your fork
3. Deploy the `frontend/` folder as the main site
4. Deploy the `backend/` folder separately (Vercel serverless, Render, or Railway)

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
