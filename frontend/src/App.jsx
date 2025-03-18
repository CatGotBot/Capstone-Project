import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'


// Import components
import Navigation from './components/Navigations.jsx';
import Resorts from './components/Resorts.jsx'
import SingleResort from './components/SingleResort.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Account from './components/Account.jsx'


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
                <h1>Welcome to list of midwest Ski Resorts!</h1>
                <p>Here's the list of ski resorts that you can review or log in to interact with them.</p>
              </div>
            } />
            <Route path="/resorts" element={<Resorts />} />
            <Route path="/resorts/:id" element={<SingleResort token={token} />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="/account" element={<Account token={token} setToken={setToken} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}


export default App
