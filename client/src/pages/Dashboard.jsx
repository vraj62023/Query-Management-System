import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import HeadDashboard from "../components/HeadDashboard";

// Import the two separate views
import AdminDashboard from "../components/AdminDashboard";
import ParticipantDashboard from "../components/ParticipantDashboard";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* 1. Common Header (Everyone sees this)
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        <h1>Query Management System</h1>
        <div>
          <span style={{ marginRight: "15px", fontWeight: "bold" }}>
             Hello, {user?.name}
          </span>
          <button 
            onClick={logout} 
            style={{ background: "red", color: "white", border: "none", padding: "8px 15px", cursor: "pointer", borderRadius: "4px" }}
          >
            Logout
          </button>
        </div>
      </div> */}

      {/* 2. The Logic Switch */}
      {/* If Admin -> Show Admin Dashboard. Else -> Show Participant Dashboard */}
  {user?.role === 'ADMIN' ? (
    <AdminDashboard />
) : user?.role === 'HEAD' ? (   // <--- New Case
    <HeadDashboard />
) : (
    <ParticipantDashboard />
)}

    </div>
  );
};

export default Dashboard;