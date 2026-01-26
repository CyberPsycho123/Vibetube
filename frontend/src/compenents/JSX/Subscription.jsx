import "../CSS/Subscription.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NoSubscription from "./NoSubscription";
import config from "../../config";

export default function Subscriptions() {
  const navigate=useNavigate()
  const [channels, setchannel] = useState([]);
  const fetch_channels = async () => {
    const res = await fetch(`${config.API_BASE_URL}/subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
    })
    const response = await res.json()
    if (response.success == true) {
      setchannel(response.channels)
    }
  }

  useEffect(() => {
    async function channel() {
      await fetch_channels()
    }
    channel()
  }, [])


  if (channels.length==0){
    return(
      <NoSubscription/>
    )
  }

  return (
    <div className="subs-page">
      <h2>Subscriptions</h2>

      <div className="subs-list">
        {channels?.map((ch, i) => (
          <div className="subs-row" key={i} onClick={()=>navigate(`/channel/${ch.name}`)}>
            <div className="left">
              <img src={ch?.avatar} alt="channel" />
              <span className="channel-name">{ch?.name}</span>
            </div>

            <button className="subscribed-btn">
              Subscribed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
