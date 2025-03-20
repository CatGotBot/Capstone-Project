import { Link, useNavigate } from "react-router-dom";

function Navigation({ token, setToken }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
    };

    if (!token) {
        return (
            <nav className="main-navigation">
                <h1 className="logo">Ski Resorts</h1>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/resorts">Browse Resorts</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </nav>
        );
    } else {
        return (
            <nav className="main-navigation">
                <h1 className="logo">Ski Resorts</h1>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/resorts">All Resorts</Link></li>
                    <li><Link to="/account">My Account</Link></li>
                    <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
        );
    }
}

export default Navigation;