import '../CSS/Login.css'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from "react-router-dom";
import config from '../../config';

const Login = () => {
    const navigate = useNavigate()
    const responsegoogle = async (authResult) => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ authResult: authResult })
            })
            const response = await res.json()
            if (response.success == true) {
                navigate('/')
            }
        } catch (err) {
            console.error("Error while requesting to google", err)
        }
    }

    const googlelogin = useGoogleLogin({
        onSuccess: responsegoogle,
        onError: responsegoogle,
        flow: 'auth-code'
    })
    return (
        <>
            <div className="login-page">
                <div className="login-card">
                    <img
                        src="/vite.svg"
                        alt="platform"
                        className="google-logo"
                    />

                    <h1>Login</h1>
                    <p className="subtitle">
                        Use your Google account to continue
                    </p>

                    <button className="google-btn" onClick={googlelogin}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="G"
                        />
                        Sign in with Google
                    </button>

                    <p className="footer-text">
                        By continuing, you agree to our
                        <span onClick={()=>window.open("https://policies.google.com/terms", "_blank", "noopener,noreferrer")}> Terms</span> and <span onClick={()=>window.open("https://policies.google.com/privacy", "_blank", "noopener,noreferrer")}>Privacy Policy</span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login
