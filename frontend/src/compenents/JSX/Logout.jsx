import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'
import config from '../../config';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const logout = async () => {
            const res = await fetch(`${config.API_BASE_URL}/logout`, {
                method: "POST",
                credentials: "include"
            });
            if (sessionStorage.getItem("shopReloaded")) {
                sessionStorage.removeItem("shopReloaded");
                window.location.reload();
            }
            navigate("/");
        };

        logout();
    }, []);


    return (
        <>
            <p>Page has successfully logout</p>
        </>
    )
}

export default Logout
