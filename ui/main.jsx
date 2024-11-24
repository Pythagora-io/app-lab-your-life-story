import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Header from './components/Header.jsx'
import './index.css'

function PageNotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4">
      <h1 className="font-bold">Page Not Found</h1>
      <p className="text-center">
        The page you are looking for does not exist.
        <br />
        <a href="/" className="underline">Go back home</a>
      </p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)