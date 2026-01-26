import "../CSS/Play.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import config from "../../config";

export default function Play({ videos }) {
    const { id } = useParams()
    const [chaninfo, setchan] = useState([])
    const [waitlike, setwaitlike] = useState(false)
    const [likes, setlike] = useState(0);
    const [clicked, setclicked] = useState(false)
    const [subs, setsubs] = useState(false)
    const [saved_video, setsaved] = useState(false)
    const [showShareTooltip, setShowShareTooltip] = useState(false)
    const [shareCopied, setShareCopied] = useState(false)
    const [showShareSuccess, setShowShareSuccess] = useState(false)
    const [expandDescription, setExpandDescription] = useState(false)
    const shareButtonRef = useRef(null)
    const shareTooltipRef = useRef(null)
    const [channelName, setChannelName] = useState(null)

    useEffect(() => {
        const video = videos.find(v => v._id === id)
        if (video) {
            setChannelName(video.channel)
        }
    }, [videos, id])

    let video_url;
    let logo;
    let video_title;
    let video_description;
    let video_date;

    for (let i = 0; i < videos.length; i++) {
        if (videos[i]._id == id) {
            video_url = videos[i].video
            logo = videos[i].logo
            video_title = videos[i].title
            video_description = videos[i].desc || "No description available"
            video_date = videos[i].Date
        }
    }

    // Share URL - change to your domain
    const shareUrl = `${window.location.origin}/watch/${id}`;

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

    // Share button functions
    const handleCopyShareUrl = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setShareCopied(true);
            setShowShareSuccess(true);
            setTimeout(() => {
                setShareCopied(false);
            }, 2000);
            setTimeout(() => {
                setShowShareSuccess(false);
            }, 2500);
        });
    };

    const handleSocialShare = (platform) => {
        const socialUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(video_title)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(video_title + ' ' + shareUrl)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(video_title)}`,
            email: `mailto:?subject=${encodeURIComponent(video_title)}&body=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        };

        if (socialUrls[platform]) {
            window.open(socialUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareButtonRef.current && !shareButtonRef.current.contains(event.target) &&
                shareTooltipRef.current && !shareTooltipRef.current.contains(event.target)) {
                setShowShareTooltip(false);
            }
        };

        if (showShareTooltip) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareTooltip]);

    const read_user_like = async () => {
        const res = await fetch(`${config.API_BASE_URL}/readlikes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ chanel: channelName, title: video_title, id: id })
        })
        const response = await res.json()
        if (response.success == true) {
            setclicked(response.click)
            setlike(response.like)
        }
    }

    const read_saved = async () => {
        const res = await fetch(`${config.API_BASE_URL}/readsaved`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ chanel: channelName, title: video_title, id: id })
        })
        const response = await res.json()
        if (response.success == true) {
            setsaved(response.saved)
        }
    }

    const authenticate = async () => {
        const res = await fetch(`${config.API_BASE_URL}/loged`, { method: "POST", credentials: 'include' });
        const response = await res.json()
        if (!response.success) {
            return 0
        }
    }

    const navigate = useNavigate()

    const subscribe = async () => {
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
                body: JSON.stringify({ chanel: channelName })
            })
            const response = await res.json()
            if (response.success == true) {
                await read_subscribe()
            }

        }
    }

    const read_subscribe = async () => {
        const res = await fetch(`${config.API_BASE_URL}/readsubscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ chanel: channelName })
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

    const user_likes = async () => {
        const auth = await authenticate()
        if (auth === 0) return navigate('/login')

        setwaitlike(true)

        const res = await fetch(`${config.API_BASE_URL}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                chanel: channelName,
                id: id
            })
        })

        const response = await res.json()
        if (response.success) {
            setlike(response.like)
            setclicked(response.click)
        }

        setwaitlike(false)
    }

    const saved = async () => {
        const auth = await authenticate()
        if (auth === 0) return navigate('/login')

        const res = await fetch(`${config.API_BASE_URL}/saved`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                chanel: channelName,
                id: id
            })
        })

        const response = await res.json()
        if (response.success) {
            setsaved(response.saved)
        }
    }

    const channel = async () => {
        const res = await fetch(`${config.API_BASE_URL}/channel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ chanel: channelName })
        });
        const response = await res.json()
        if (response.success == true) {
            setchan(response.ytchannel)
        }
    }

    useEffect(() => {
        if (!channelName || !id) return;

        async function channels() {
            await channel()
            await read_subscribe()
            await read_saved()
            await read_user_like()

        }
        channels()
    }, [id, channelName, chaninfo])


    return (
        <div className="watch-page">
            {/* LEFT SECTION */}
            <div className="main-video">
                <div className="video-wrapper">
                    <video
                        src={video_url}
                        controls
                        autoPlay
                    />
                </div>

                <h1 className="video-title" style={{ fontSize: 20 }}>
                    {video_title}
                </h1>

                <div className="video-actions">
                    <div className="channel">
                        <div className="subscriber">
                            <img src={logo} className="avatar" onClick={() => navigate(`/channel/${channelName}`)} />
                            <div>
                                <p className="channel-name">{channelName}</p>
                                <span>{chaninfo?.subscribers} subscribers</span>
                            </div>
                            <button className="subscribe-btn" onClick={subscribe} style={subs ? { color: 'black', backgroundColor: '#e5e5e5' } : { color: 'white', backgroundColor: 'blueviolet' }}>{subs ? "subscribed" : "subscribe"}</button>
                        </div>
                        <div className="actions">
                            <button disabled={waitlike} onClick={user_likes}>{clicked ? <FaHeart style={{ color: "blueviolet" }} /> : <FaRegHeart style={{ color: "blueviolet" }} />}{likes}</button>

                            {/* Share Button */}
                            <button
                                ref={shareButtonRef}
                                onClick={() => setShowShareTooltip(!showShareTooltip)}
                                className="actions"
                                title="Share video"
                            >
                                <span>⬆️ Share</span>
                            </button>

                            {/* Share Modal Popup */}
                            {showShareTooltip && (
                                <>
                                    <div
                                        className="share-modal-overlay"
                                        onClick={() => setShowShareTooltip(false)}
                                    />
                                    <div ref={shareTooltipRef} className="share-modal">
                                        <div className="share-modal-header">
                                            <h3>Share</h3>
                                            <button
                                                className="share-close-btn"
                                                onClick={() => setShowShareTooltip(false)}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="share-modal-content">
                                            {showShareSuccess && (
                                                <div className="share-success">
                                                    ✓ Link copied!
                                                </div>
                                            )}

                                            <div className="share-url-section">
                                                <input
                                                    type="text"
                                                    className="share-url-input"
                                                    value={shareUrl}
                                                    readOnly
                                                />
                                                <button
                                                    onClick={handleCopyShareUrl}
                                                    className={`share-copy-btn ${shareCopied ? 'copied' : ''}`}
                                                >
                                                    {shareCopied ? '✓ Copied' : 'Copy'}
                                                </button>
                                            </div>

                                            <div className="share-social-grid">
                                                <button
                                                    onClick={() => handleSocialShare('facebook')}
                                                    className="share-social-btn"
                                                >
                                                    <span className="share-social-icon">f</span>
                                                    <span>Facebook</span>
                                                </button>

                                                <button
                                                    onClick={() => handleSocialShare('twitter')}
                                                    className="share-social-btn"
                                                >
                                                    <span className="share-social-icon">𝕏</span>
                                                    <span>Twitter</span>
                                                </button>

                                                <button
                                                    onClick={() => handleSocialShare('whatsapp')}
                                                    className="share-social-btn"
                                                >
                                                    <span className="share-social-icon">💬</span>
                                                    <span>WhatsApp</span>
                                                </button>

                                                <button
                                                    onClick={() => handleSocialShare('telegram')}
                                                    className="share-social-btn"
                                                >
                                                    <span className="share-social-icon">✈️</span>
                                                    <span>Telegram</span>
                                                </button>

                                                <button
                                                    onClick={() => handleSocialShare('email')}
                                                    className="share-social-btn"
                                                >
                                                    <span className="share-social-icon">✉️</span>
                                                    <span>Email</span>
                                                </button>

                                                <button
                                                    onClick={() => handleSocialShare('linkedin')}
                                                    className="share-social-btn"
                                                >
                                                    <span className="share-social-icon">in</span>
                                                    <span>LinkedIn</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                onClick={saved}
                                style={{
                                    backgroundColor: saved_video ? "rgb(184, 143, 223)" : "",
                                    color: saved_video ? "white" : ""
                                }}
                            >
                                {saved_video ? "saved" : "💾 Save"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* VIDEO DESCRIPTION SECTION */}
                <div className="video-description-section">
                    <div className="description-header">
                        <div className="description-meta">
                            <span className="upload-date">{timeAgo(parseDMY(video_date))}</span>
                        </div>
                    </div>

                    <div className={`description-content ${expandDescription ? 'expanded' : ''}`}>
                        <p className="description-text">{video_description}</p>
                    </div>

                    <button
                        className="description-toggle-btn"
                        onClick={() => setExpandDescription(!expandDescription)}
                    >
                        {expandDescription ? 'Show less' : 'Show more'}
                    </button>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="slidebar">
                <h3>Recommended</h3>

                {[...videos].reverse().map((item) => (
                    <div className="side-video" key={item} onClick={() => { navigate(`/watch/${item._id}`) }}>
                        <img
                            src={item.thumbnail}
                            alt="thumbnail"
                        />
                        <div>
                            <p className="side-title">
                                {item.title}
                            </p>
                            <span>{item.channel}</span>
                            <br />
                            <span>{timeAgo(parseDMY(item.Date))}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}