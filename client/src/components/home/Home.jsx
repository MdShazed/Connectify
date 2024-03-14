import { React, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard, faPlus } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../nav/Navbar";
import vector from "../../assets/1.svg";
import "./sass/home.css";

const Home = ({ meetingIdInput, setMeetingIdInput, socketInstance }) => {
  const [joinBtnCondition, setJoinBtnCondition] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  sessionStorage.removeItem("isCreatingMeeting");

  const navigate = useNavigate();

  const handleMeetingInputChange = (e) => {
    setMeetingIdInput(e.target.value);
    e.target.value.length !== 0
      ? setJoinBtnCondition(true)
      : setJoinBtnCondition(false);
  };

  const handleMeetingInput = async () => {
    axios
      // .post("http://localhost:3000/api/v1/check-meeting-exist", {
      .post(
        "https://connectify-server-mzzc.onrender.com/api/v1/check-meeting-exist",
        {
          meetingIdInput,
        }
      )
      .then((res) => {
        navigate(`/lobby`);
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
  };

  const handleClick = () => {
    window.open("https://shazed.netlify.app", "_blank");
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const plus = <FontAwesomeIcon className="plus-icon" icon={faPlus} />;
  const keyboard = (
    <FontAwesomeIcon className="keyboard-icon" icon={faKeyboard} />
  );

  const createMeeting = () => {
    sessionStorage.setItem("isCreatingMeeting", true);
    navigate("/lobby");
  };

  return (
    <>
      <Navbar />
      <main id="home">
        <div className="left">
          <div className="bar" onClick={handleClick}>
            <span>{"Click here to discover more projects like this >>>"}</span>
          </div>
          <header>
            <h1>
              Video calls and meetings for <br /> <span>everyone.</span>
            </h1>
            <p>
              Connectify provides secure, easy to use video calls and <br />
              meetings for everyone, on any device.
            </p>
          </header>
          {/* header ends */}
          <div className="inputs">
            <button className="new-meeting" onClick={createMeeting}>
              {plus} New meeting
            </button>
            <div className={`input ${isInputFocused ? "input-focused" : ""}`}>
              {keyboard}
              <input
                type="text"
                placeholder="Enter a code or link"
                onChange={handleMeetingInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <button
              className={`join ${joinBtnCondition ? "joinV2" : ""}`}
              onClick={handleMeetingInput}
              disabled={!joinBtnCondition}
            >
              Join
            </button>
            {/* inputs ends */}
          </div>
          <hr />
          <span className="credits">
            Made by Shazed &nbsp;
            <a href="https://shazed.netlify.app" target="__blank">
              Learn more
            </a>
            .
          </span>
        </div>
        <div className="right">
          <img src={vector} alt="" />
        </div>
      </main>
    </>
  );
};

export default Home;
