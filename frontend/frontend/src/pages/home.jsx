import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { AuthContext } from "../contexts/AuthContext";
import mobileImg from "../assets/e1a84655-61ae-495b-9c9d-b62e50f2c9e1.jpg";

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (meetingCode.trim() !== "") {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
    } else {
      alert("Please enter a meeting code");
    }
  };

  return (
    <div className="homeContainer">
      <nav className="navBar">
        {/* LEFT SIDE: Home Button FIRST, then Title */}
        <div className="navHeader">
          <Button 
            className="homeBtn"
            variant="contained" 
            onClick={() => navigate("/")}
            style={{ backgroundColor: "#444", color: "white", marginRight: "20px" }}
          >
            Home
          </Button>
          <h2>Vimlesh Video Call</h2>
        </div>

        {/* RIGHT SIDE: History + Logout */}
        <div className="navlist">
          <div className="historySection" onClick={() => navigate("/history")}>
            <IconButton style={{ color: "white" }}>
              <RestoreIcon />
            </IconButton>
            <p>History</p>
          </div>
          <Button
            variant="contained"
            className="logoutBtn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </nav>

      <div className="meetContainer">
        <div className="leftPanel">
          <h2>Providing Quality Video Call Just Like Quality Education</h2>
          <div className="inputGroup">
            <TextField
              onChange={(e) => setMeetingCode(e.target.value)}
              label="Meeting Code"
              variant="outlined"
              fullWidth
            />
            <Button onClick={handleJoinVideoCall} variant="contained" size="large">
              Join
            </Button>
          </div>
        </div>
        <div className="rightPanel">
          <img src={mobileImg} alt="mobile preview" />
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomeComponent);