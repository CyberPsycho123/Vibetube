import "../CSS/Saved.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Unavailable from './Unavailable'
import config from "../../config";


export default function Saved() {

  const navigate = useNavigate()
  const [videos, setvideo] = useState([])


  const timeAgo = (dateInput) => {
    const now = new Date();
    const past = new Date(dateInput);

    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - past.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const parseDMY = (dmy) => {
    const [day, month, year] = dmy.split("-");
    return new Date(year, month - 1, day);
  };

  const fetch_video = async () => {
    const res = await fetch(`${config.API_BASE_URL}/savedioes`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      }
    })
    const response = await res.json()
    if (response.success == true) {
      setvideo(response.saved_videos.saveds || [])
    }

  }

  useEffect(() => {
    async function load_videos() {
      await fetch_video()
    }
    load_videos()
  }, [])

  return (
    <div className="container" style={{ justifyContent: 'left' }}>

      <div className="content-wrapper">
        {videos.length > 0 ? (
          <div className="videos-container">
            {videos.map((video) => (
              <div
                key={video.video_id}
                className="video-row"
              >
                <div className="thumbnail-wrapper" onClick={() => { navigate(`/watch/${video.video_id}`) }}>
                  <img className="thumbnail" src={video.thumbnail} />
                  <div className="play-button">▶</div>
                  <div className="duration-badge">{video.duration}</div>
                </div>

                <div className="video-info">
                  <div className="title-section">
                    <div className="video-title">{video.title}</div>
                  </div>

                  <div className="metadata">
                    <span className="channel-name">{video.channel}</span>
                    <div className="video-stats">
                      <span>{timeAgo(parseDMY(video.Date))}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Unavailable desc="You didnt saved videos" />
        )}
      </div>
    </div>
  );
}
