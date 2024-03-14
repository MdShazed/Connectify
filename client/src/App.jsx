import { React, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./components/home/Home";
import SignIn from "./components/forms/sign-in/SignIn";
import SignUp from "./components/forms//sign-up/SignUp";
import Lobby from "./components/lobby/Lobby";
import Room from "./components/room/Room";

import "./App.css";
import Test from "./components/test/Test";

const App = () => {
  const [meetingIdInput, setMeetingIdInput] = useState(); // the join meeting inputField value
  const [name, setName] = useState(""); // name from the lobby
  const socketInstance = useRef(null); // actual socket io element from the lobby
  const peerInstance = useRef(null); // actual peer element from the lobby
  const [peerId, setPeerId] = useState("");

  return (
    <>
      <Toaster containerClassName="toaster" />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              meetingIdInput={meetingIdInput}
              setMeetingIdInput={setMeetingIdInput}
              socketInstance={socketInstance}
            />
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/lobby"
          element={
            <Lobby
              socketInstance={socketInstance}
              peerInstance={peerInstance}
              name={name}
              setName={setName}
              meetingIdInput={meetingIdInput}
              setPeerId={setPeerId}
            />
          }
        />

        <Route
          path="/room/:meetingId"
          element={
            <Room
              socketInstance={socketInstance}
              peerInstance={peerInstance}
              name={name}
              peerId={peerId}
            />
          }
        />

        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
};

export default App;
