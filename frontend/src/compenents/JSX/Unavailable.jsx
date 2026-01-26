import { useNavigate } from 'react-router';
import '../CSS/Unavailable.css';

export default function NoVideos({desc}) {
  const navigate=useNavigate()
  const handleExplore = () => {
    navigate('/');
  };

  return (
    <div className="nv-container">

      <div className="nv-content-wrapper">
        <div className="nv-empty-state">
          <div className="nv-empty-icon">🎬</div>
          <div className="nv-empty-text">No videos available</div>
          <div className="nv-empty-subtext">
            {desc}
          </div>


          <div className="nv-action-buttons">
            <button className="nv-btn nv-btn-primary" onClick={handleExplore}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}