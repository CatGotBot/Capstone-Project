import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Navigation from './components/Navigations.jsx';
import Resorts from './components/Resorts.jsx';
import SingleResort from './components/SingleResort.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Account from './components/Account.jsx';
import NewResort from './components/NewResort.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Handle token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  return (
    <Router>
      <div className="app-container">
        <Navigation token={token} setToken={setToken} />
        <main className="content">
          <Routes>
            <Route path="/" element={
              <div className="home-page">
                <h1>Welcome to Midwest Ski Resorts!</h1>
                <p>This website was created for ski/snowboard people alike, here you can find different resorts that people recommend the most!</p>
                <p>Log in or register to explore ski resort details about resorts and contribute more to our community!</p>
              </div>
            } />
            <Route path="/resorts" element={<Resorts token={token} />} />
            <Route path="/resorts/new" element={<NewResort token={token} />} />
            <Route path="/resorts/:id" element={<SingleResort token={token} />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="/account" element={<Account token={token} setToken={setToken} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
