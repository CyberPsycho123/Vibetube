import "../CSS/Channel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Home from "./Home";
import config from "../../config";
import { useParams } from "react-router";

export default function Channel() {
  const { chanel } = useParams()
  const [filtered, setvideo] = useState([])
  const [videolen, setlen] = useState(0)
  const [chaninfo, setchan] = useState([])
  const [subs, setsubs] = useState(false)
  const navigate = useNavigate()


  const authenticate = async () => {
    const res = await fetch(`${config.API_BASE_URL}/loged`, { method: "POST", credentials: 'include' });
    const response = await res.json()
    if (!response.success) {
      return 0
    }
  }

  
  const read_subscribe = async () => {
    const res = await fetch(`${config.API_BASE_URL}/readsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ chanel: chanel })
    })
    const response = await res.json()
    if (response.success == true) {
      if (response.subscribed == true) {
        setsubs(true)
      }
      else {
        setsubs(false)
      }
    }

  }

  const subscribed = async () => {
    const auth = await authenticate()
    if (auth == 0) {
      navigate('/login')
    }
    else {
      const res = await fetch(`${config.API_BASE_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ chanel: chanel })
      })
      const response = await res.json()
      if (response.success == true) {
        await read_subscribe()
      }

    }
  }
  const channel = async () => {
    const res = await fetch(`${config.API_BASE_URL}/channel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ chanel: chanel })
    });
    const response = await res.json()
    if (response.success == true) {
      setvideo(response.videos)
      setchan(response.ytchannel)
      setlen(response.videos.length)
    }
  }

  useEffect(() => {
    async function channels() {
      await channel()
      await read_subscribe()
    }
    channels()
  }, [chaninfo])

  const videos=filtered.filter((vid)=>vid.visibility=="Public")

  return (
    <div className="channel-page">
      {/* CHANNEL HEADER */}
      <div className="channel-header">
        <img src={chaninfo?.logo} className="channel-logo" />

        <div className="channel-info">
          <h1>{chanel}</h1>
          <p>{chaninfo?.subscribers} subscribers • {videolen} videos</p>
          <button className="subscribe-btn" onClick={subscribed} style={subs ? {color:'black',backgroundColor:'#e5e5e5'} : {color:'white',backgroundColor:'blueviolet'} }>{subs ? "subscribed" : "subscribe"}</button>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <span className="active">Videos</span>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <button className="active">Latest</button>
      </div>

      {/* VIDEO GRID */}
      <div className="video-grind">
        <Home videos={videos} />
      </div>
    </div>
  );
}
