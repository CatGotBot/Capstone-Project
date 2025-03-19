import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Account({ token, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  
  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch('/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error(error.message);
        // If token is invalid, kick user out
        handleLogout();
      }
    }
    
    if (token) getUserData();
  }, [token]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/account");
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/account");
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };
  
  if (!token) {
    return (
      <div className="auth-container">
        <h2>Login or Register</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-buttons">
            <button type="submit" className="login-btn">Login</button>
            <button type="button" onClick={handleRegister} className="register-btn">Register</button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div className="account-container">
      <h2>Welcome, {user.username}!</h2>
      <p>You're successfully logged in.</p>
      
      <div className="user-info">
        <h3>Your Account Details</h3>
        <p>Username: {user.username}</p>
        <p>User ID: {user.id}</p>
      </div>
      
      <div className="resorts-section">
        <h3>Ski Resorts</h3>
        <p>View available ski resorts or manage them if you have admin privileges.</p>
        <button onClick={() => navigate("/resorts")}>View Resorts</button>
      </div>
      
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Account;