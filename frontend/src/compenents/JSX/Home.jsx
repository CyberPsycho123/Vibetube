import { useNavigate } from 'react-router';
import '../CSS/Home.css';

const Home = ({ videos }) => {
  const navigate = useNavigate()


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

  return (
    <div className="yt-container">
      <div className="yt-grid">
        {[...videos].reverse().map((video) => (
          <div key={video.id} className="yt-video-card" onClick={() => { navigate(`/watch/${video._id}`) }}>
            <div className="yt-thumbnail-container">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="yt-thumbnail"
                loading="lazy"
              />
              <span className="yt-duration">{video.duration}</span>
            </div>

            <div className="yt-video-info">
              <img
                src={video.logo}
                alt={video.channel}
                className="yt-avatar"
                loading="lazy"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/channel/${video.channel}`)
                }}
              />

              <div className="yt-video-details" >
                <h3 className="yt-title" >{video.title}</h3>
                <div className="yt-channel-info">
                  <p className="yt-channel">
                    {video.channel}
                  </p>
                  <div className="yt-metadata">
                    <span className="yt-time">{timeAgo(parseDMY(video.Date))}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;