import { React, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

import logo from "../../assets/connectify.png";

import "./sass/lobby.css";

const Lobby = ({
  socketInstance,
  peerInstance,
  name,
  setName,
  meetingIdInput,
  setPeerId,
}) => {
  const navigate = useNavigate();

  let isCreatingMeeting = sessionStorage.getItem("isCreatingMeeting");

  useEffect(() => {
    // const socket = io("http://localhost:3000");
    const socket = io("https://connectify-server-mzzc.onrender.com");
    socketInstance.current = socket;

    const peer = new Peer();
    peerInstance.current = peer;

    let peerId;
    peer.on("open", (id) => {
      peerId = id;
      setPeerId(id);
      console.log("peerId: ", id);
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });

    if (isCreatingMeeting) {
      socket.on("meeting-created", (meetingId) => {
        navigate(`/room/${meetingId}`);
      });
    } else {
      socket.on("meeting-joined", (data) => {
        socket.emit("get-peerId", peerId, meetingIdInput);
        peerId = "";

        navigate(`/room/${meetingIdInput}`);
        socket.emit("get-participants", meetingIdInput); // update participants number for the other users
      });
    }
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (isCreatingMeeting) {
      socketInstance.current.emit("create-meeting", name);
    } else {
      socketInstance.current.emit("join-meeting", name, meetingIdInput);
    }
  };

  const returnHome = () => {
    navigate("/");
    sessionStorage.removeItem("isCreatingMeeting");
    socketInstance.current.disconnect();
    setName("");
  };

  return (
    <>
      <main id="lobby">
        <div className="lobby-box">
          <div className="cam">
            <Webcam className="webcam-preview" />
          </div>
          <form onSubmit={handleJoin}>
            <div className="logo">
              <img src={logo} alt="connectify" />
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`join-btn ${name !== "" ? "join-btn-active" : ""} `}
              disabled={name == "" ? true : false}
            >
              Join
            </button>
            <p>
              Return <span onClick={returnHome}>home</span>
            </p>
          </form>
        </div>
      </main>
    </>
  );
};

export default Lobby;
