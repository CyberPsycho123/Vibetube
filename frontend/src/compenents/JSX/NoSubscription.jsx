import '../CSS/NoSubscription.css';
import { useNavigate } from 'react-router';

export default function NoSubscription() {
  const navigate=useNavigate()
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="ns-container">

      <div className="ns-content-wrapper">
        <div className="ns-empty-state">
          <div className="ns-empty-icon">📺</div>
          <div className="ns-empty-text">No subscriptions yet</div>
          <div className="ns-empty-subtext">
            Subscribe to channels to see them here
          </div>
          <div className="ns-empty-description">
            Start following your favorite creators to get their latest uploads directly in your subscriptions feed
          </div>

          <div className="ns-action-buttons">
            <button className="ns-btn ns-btn-secondary" onClick={handleGoHome}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}