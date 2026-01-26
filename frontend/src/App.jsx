import './App.css'
import Navbar from './compenents/JSX/Navbar'
import Home from './compenents/JSX/Home'
import Play from './compenents/JSX/Play'
import Channel from './compenents/JSX/Channel'
import Admin from './compenents/JSX/Admin'
import Subscription from './compenents/JSX/Subscription'
import Logout from './compenents/JSX/Logout'
import Search from './compenents/JSX/Search'
import { useState, useEffect } from 'react'
import Videouploads from './compenents/JSX/Videouploads'
import Login from './compenents/JSX/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Saved from './compenents/JSX/Saved'
import EditVideo from './compenents/JSX/EditVideo'
import { GoogleOAuthProvider } from '@react-oauth/google'
import EditChannel from './compenents/JSX/EditChannel'
import config from './config'

function App() {
  const GoogleAuthWapper = () => {
    return (
      <GoogleOAuthProvider clientId='1060914793989-ffhlhjob453iq5aiucjfejf6s3jafnt7.apps.googleusercontent.com'>
        <Login />
      </GoogleOAuthProvider>
    )
  }


  const [loading, setload] = useState(true)
  const [filtered, setvideo] = useState([])
  const videos = async () => {
    const res = await fetch(`${config.API_BASE_URL}/videos`, { method: "POST" });
    const response = await res.json()
    if (response.success == true) {
      setvideo(response.videos)
    }
  }

  const video=filtered.filter((vid)=>vid.visibility=="Public")
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}`, { method: "GET" });
        if (res.ok) {
          setload(false)
          await videos();
          clearInterval(interval);
        }
      } catch { }
    }, 2000);

    return () => {
      clearInterval(interval)
    };
  }, []);










  function Layout({ children, loading }) {
    return (
      <>
        <Navbar />
        {loading ? (
          <div className='container' style={{ height: '100vh', justifyContent: 'center',backgroundColor:'white' }}>
            <div className="spinner"></div>
            <p>Waiting for server...</p>
          </div>
        ) : (
          <main>{children}</main>
        )}

      </>
    )
  }


  const Router = createBrowserRouter([
    {
      path: "/",
      element: <Layout loading={loading}><Home videos={video} /></Layout>
    },
    {
      path: "/watch/:id",
      element: <Layout loading={loading}><Play videos={video} /></Layout>
    },
    {
      path: "/search/:text",
      element: <Layout loading={loading}><Search videos={video} /></Layout>
    },
    {
      path: "/admin",
      element: <Layout loading={loading}><Admin /></Layout>
    },
    {
      path: "/channel/:chanel",
      element: <Layout loading={loading}><Channel /></Layout>
    },
    {
      path: "/saved",
      element: <Layout loading={loading}><Saved /></Layout>
    },
    {
      path: "/login",
      element: <GoogleAuthWapper />
    },
    {
      path: "/subscription",
      element: <Layout loading={loading}><Subscription /></Layout>
    },
    {
      path: "/logout",
      element: <Logout />
    },
    {
      path: "/admin/upload",
      element: <Layout loading={loading}><Videouploads /></Layout>
    },
    {
      path: "/admin/edit/:id",
      element: <Layout loading={loading}><EditVideo /></Layout>
    },
    {
      path: "/admin/channeledit",
      element: <Layout loading={loading}><EditChannel /></Layout>
    }
  ])
  return (
    <RouterProvider router={Router} />
  )
}

export default App
