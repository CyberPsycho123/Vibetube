import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa"; // Added FaBars for the Menu Icon
import "../CSS/Navbar.css";
import config from "../../config";


const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [ismobsearch, setismobsearch] = useState(false);
  const [profile,setprofile]=useState("")
  const [signed, setsign] = useState(false)
  const navigate = useNavigate();
  const searchbar = useRef(null)
  const [channel_name,setname]=useState("")
  const location = useLocation();
  const forceFocusHandler = () => {
    searchbar.current.focus();
  };
  const handleSearch = () => {
    if (searchQuery.trim().length < 1) return;
    setismobsearch(false)
    navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
  };


  useEffect(() => {
    if (ismobsearch && searchbar.current) {
      searchbar.current?.focus();
    }

    document.addEventListener("click", forceFocusHandler, true)

    return () => { document.removeEventListener("click", forceFocusHandler, true) }
  }, [ismobsearch]);



  // Close all menus upon route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsSidebarOpen(false);
    setSearchQuery("")
  }, [location.pathname]);

  // Handle closing the profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the profile elements (dropdown or toggle button)
      if (isProfileOpen && !event.target.closest('.profiles')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  const click_icon = () => {
    setismobsearch(true)
  }


  const authenticate = async () => {
    const interval = setInterval(async () => {
      const res = await fetch(`${config.API_BASE_URL}/loged`, { method: "POST", credentials: 'include' });
      const response = await res.json()
      if (response.success == true) {
        clearInterval(interval)
        setprofile(response.profile)
        setname(response.channel)
        setsign(true)
      }
      else {
        setsign(false)
      }
    }, 1000);

  }
  useEffect(() => {
    async function authenticated() {
      await authenticate()
    }
    authenticated()
  }, [])

  if (!ismobsearch) {
    return (
      <>
        <nav className="navbar">
          {/* Menu Toggle: Now visible on ALL screen sizes */}
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar menu"
            aria-expanded={isSidebarOpen}
            style={{fontSize:25}}
          >
            <FaBars /> {/* Using FaBars for a clearer icon */}
          </button>

          <div className="logo" onClick={() => navigate('/')} style={{fontSize:25}}>
            Vibe<span>Tube</span>
          </div>

          {/* Search Bar */}
          <div className="searchbar">
            <input
              type="text"
              style={{fontSize:15}}
              placeholder="Search VibeTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button className="icon" onClick={handleSearch} aria-label="Search">
              <FaSearch style={{ color: 'white', fontSize:20}} />
            </button>
          </div>

          <button
            className="search-mobile-toggle"
            onClick={click_icon}
            aria-label="Open search on mobile"
          >
            <FaSearch className="mobile-search-icon" />
          </button>
          <div className="profiles">
            {signed ? (
              <>
                <button
                  className="profile-toggle-btn"
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  aria-label="User profile and settings menu"
                  aria-expanded={isProfileOpen}
                >
                  <img src={profile} className="profile-icon" />
                </button>

                <div className={`profile-dropdown ${isProfileOpen ? "show" : "hide"}`}>
                  <h2 style={{marginLeft:15,marginTop:10}}>{channel_name}</h2>
                  <br/>
                  <p style={{fontSize:15}} onClick={() => { navigate('/admin'); setIsProfileOpen(false); }}>
                    View Your Channel
                  </p>
                  <p style={{fontSize:15}} onClick={() => { navigate('/admin/channeledit');  setIsProfileOpen(false); }}>
                    Edit Channel
                  </p>
                  <p onClick={() => {
                    navigate('/logout')
                    setIsProfileOpen(false);
                  }} style={{fontSize:15}} className="signout">
                    Sign Out
                  </p>
                </div>
              </>
            ) : (
              <button className="login-button" onClick={() => { navigate('/login') }}>Login</button>
            )}
          </div>

        </nav>

        {/* Sidebar, Overlay (Rest remains the same) */}
        <aside className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar menu">
            ✕
          </button>

          <ul>
            <li onClick={() => navigate('/')}>Home</li>
            <li onClick={() => navigate('/subscription')}>Subscriptions</li>
            <li onClick={() => navigate('/saved')}>Saved Videos</li>
          </ul>
        </aside>

        <div
          className={`overlay ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden={!isSidebarOpen}
        ></div>
      </>
    );
  }
  else {
    return (
      <>
        <nav className="navb">
          <input
            type="text"
            placeholder="Search VibeTube..."
            value={searchQuery}
            ref={searchbar}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </nav>
      </>
    )
  }
}
export default Navbar;