import React, { useState } from 'react';
import '../CSS/Search.css';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import Unavailable from './Unavailable'

const Search = ({ videos }) => {
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
  const { text } = useParams()
  const searchResults = videos.filter(video => video.title.toLowerCase().includes(text.toLowerCase()));
  if (searchResults.length == 0) {
    return (
      <Unavailable desc="We couldnt search the videos" />
    )
  }
  return (
    <div className="search-container">
      <div className="search-results">
        {searchResults.map((video) => (
          <div key={video._id} className="search-result-item" onClick={() => navigate(`/watch/${video._id}`)}>
            <div className="search-thumbnail-wrapper">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="search-thumbnail"
                loading="lazy"
              />
              <span className="search-duration">{video.duration}</span>
            </div>

            <div className="search-video-info">
              <h3 className="search-title">{video.title}</h3>
              <div className="search-metadata">
                <span className="search-time">{timeAgo(parseDMY(video.Date))}</span>
              </div>

              <div className="search-channel-info">
                <img
                  src={video.logo}
                  alt={video.channel}
                  className="search-channel-avatar"
                  loading="lazy"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/channel/${video.channel}`)
                  }}
                />
                <div className="search-channel-details">
                  <p className="search-channel-name">
                    {video.channel}
                  </p>
                </div>
              </div>

              <p className="search-description">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;