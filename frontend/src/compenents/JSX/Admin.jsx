import "../CSS/Admin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";

export default function Admin() {
  const navigate = useNavigate()
  const [videos, setvideos] = useState([])
  const fetch_videos = async () => {
    const res = await fetch(`${config.API_BASE_URL}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
    });
    const response = await res.json()
    if (response.success == true) {
      setvideos(response.videos)
    }

  }

  const deletes = async(id) => {
    const res = await fetch(`${config.API_BASE_URL}/videodelete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ id: id })
    });
    const response=await res.json()
    if (response.success==true){
      await fetch_videos() 
    }
  }

  const authenticate = async () => {
    const res = await fetch(`${config.API_BASE_URL}/loged`, { method: "POST", credentials: 'include' });
    const response = await res.json()
    if (response.success == true) {
      navigate('/admin')
    }
    else {
      navigate('/login')
    }
  }
  useEffect(() => {
    async function authenticated() {
      await authenticate()
      await fetch_videos()
    }
    authenticated()

  }, [])

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h1>Your Videos</h1>
        <button className="upload-btn" style={{ backgroundColor: 'blueviolet', width: 160, padding: 10 }} onClick={() => navigate('/admin/upload')}>⬆ Upload Video</button>
      </div>

      {/* VIDEO LIST */}
      <div className="video-table">
        <div className="table-head">
          <span>Video</span>
          <spna>Duration</spna>
          <span>Visibility</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {[...videos]?.reverse().map((video, index) => (
          <div className="table-row" key={index}>
            <div className="video-cell">
              <img src={video.thumbnail} alt={video.title} />
              <p>{video.title}</p>
            </div>
            <span>{video.duration}</span>
            <span>
              {video.visibility}
            </span>
            <span>{video.Date}</span>

            <div className="actions">
              <button onClick={() => { navigate(`/admin/edit/${video._id}`) }}>Edit</button>
              <button className="delete" onClick={() => deletes(video._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
