
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';  
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Login from './pages/Login.jsx';
import AuthContext from './context/AuthContext.jsx';
import Landing from "./pages/Landing";
import{useContext} from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Register from "./pages/Register";
function App() {
  return (
    <Router>
      <ToastContainer /> {/* This allows the popup alerts to show anywhere */}
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
export default App;
