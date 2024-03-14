import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faMessage,
  faPhone,
  faShare,
  faUserGroup,
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

import ParticipantsBox from "./ParticipantsBox";
import ShareBox from "./ShareBox";

import "./sass/room.css";

const Room = ({ socketInstance, peerInstance, name, peerId }) => {
  const { meetingId } = useParams();

  const [participants, setParticipants] = useState(); // list of all the participants

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [messageIndicator, setMessageIndicator] = useState(false);
  const [isShareBoxOpen, setIsShareBoxOpen] = useState(false);
  const [isParticipantsBoxOpen, setIsParticipantsBoxOpen] = useState(false);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const [myStream, setMyStream] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);

  const navigate = useNavigate();

  // useEffect(() => {
  //   window.addEventListener("beforeunload", (e) => e.preventDefault());
  // }, []);

  useEffect(() => {
    let stream;

    const getStream = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMyStream(stream);
    };

    getStream();

    try {
      socketInstance.current.on("meeting-joined", (data) => {
        toast(data, {
          duration: 3000,
        });
      });

      socketInstance.current.on("get-peerId", async (peerId) => {
        const call = peerInstance.current.call(peerId, stream);
        call.once("stream", (remoteStream) => {
          setRemoteStreams((prevArray) => [
            ...prevArray,
            { remoteStream, peerId },
          ]);

          //
        });

        // another way to remove stream (unstable)
        // call.on("close", () => {
        //   console.log(`Peer ${peerId} disconnected CALL`);
        //   setRemoteStreams((prevUsers) =>
        //     prevUsers.filter((stream) => stream.peerId !== peerId)
        //   );
        // });
      });

      peerInstance.current.on("call", async (call) => {
        call.answer(stream);
        call.once("stream", (remoteStream) => {
          let peerId = call.peer; // other user peerId
          setRemoteStreams((prevArray) => [
            ...prevArray,
            { remoteStream, peerId },
          ]);

          //
        });

        // another way to remove stream (unstable)
        // call.on("close", () => {
        //   console.log(`Peer ${peerId} disconnected ANS`);
        //   setRemoteStreams((prevUsers) =>
        //     prevUsers.filter((stream) => stream.peerId !== peerId)
        //   );
        // });
      });

      socketInstance.current.on("disconnected-user-peerId", (peerId) => {
        setRemoteStreams((prevUsers) =>
          prevUsers.filter((stream) => stream.peerId !== peerId)
        );
      });

      socketInstance.current.on("get-participants-list", (data) => {
        setParticipants(data);
      });

      socketInstance.current.on("message", (data) => {
        setMessageIndicator(true);
        setMessages((prevArray) => [...prevArray, data]);
      });

      socketInstance.current.on("user-left", (data) => {
        socketInstance.current.emit("get-participants", meetingId);
        toast(data, {
          duration: 3000,
        });
      });

      socketInstance.current.on("disconnect", () => {
        stream &&
          stream.getTracks().forEach((track) => {
            track.stop();
          });

        peerInstance.current.destroy();
      });

      // more code...
    } catch (e) {
      navigate("/");
    }

    return () => {
      try {
        sessionStorage.removeItem("isCreatingMeeting");
        socketInstance.current.disconnect();
      } catch (e) {
        sessionStorage.removeItem("isCreatingMeeting");
        navigate("/");
      }
    };
  }, []);

  useEffect(() => {
    socketInstance.current.on("toggleVideo", (peerId, isVideoOn, name) => {
      try {
        const foundUser = remoteStreams.find((user) => user.peerId === peerId);

        foundUser.remoteStream.getVideoTracks().forEach((track) => {
          track.enabled = isVideoOn;
        });

        toast(`${name} turn ${isVideoOn ? "on" : "off"} the camera`, {
          duration: 3000,
        });
      } catch (error) {
        null;
      }
    });

    socketInstance.current.on("toggleMic", (peerId, isMicOn, name) => {
      try {
        const foundUser = remoteStreams.find((user) => user.peerId === peerId);

        foundUser.remoteStream.getAudioTracks().forEach((track) => {
          track.enabled = isMicOn;
        });

        toast(`${name} turn ${isMicOn ? "on" : "off"} the mic`, {
          duration: 3000,
        });
      } catch (error) {
        null;
      }
    });
  }, [remoteStreams]);

  useEffect(() => {
    socketInstance.current.emit(
      "toggleVideo",
      peerId,
      isVideoOn,
      meetingId,
      name
    );

    myStream &&
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn;
      });
  }, [isVideoOn]);

  useEffect(() => {
    socketInstance.current.emit("toggleMic", peerId, isMicOn, meetingId, name);
    // muting the mic don't make any sense it's already muted
  }, [isMicOn]);

  const handleEndCall = () => {
    sessionStorage.removeItem("isCreatingMeeting");
    socketInstance.current.emit("disconnected-user-peerId", peerId, meetingId);
    socketInstance.current.disconnect();
    navigate("/");
  };

  const getParticipants = () => {
    setIsParticipantsBoxOpen(!isParticipantsBoxOpen);
    socketInstance.current.emit("get-participants", meetingId);
  };

  const openChatBox = () => {
    setIsChatBoxOpen(!isChatBoxOpen);
    setMessageIndicator(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.length !== 0) {
      socketInstance.current.emit("message", { meetingId, name, message });
      setMessages((prevArray) => [...prevArray, `${name}: ${message}`]);
      setMessage("");
      setMessageIndicator(false);
    }
  };

  // icons

  const copy = <FontAwesomeIcon className=" icon" icon={faCopy} />;
  const phone = <FontAwesomeIcon className=" icon" icon={faPhone} />;
  const sms = <FontAwesomeIcon className="icon" icon={faMessage} />;
  const share = <FontAwesomeIcon className=" icon" icon={faShare} />;
  const participantsIcon = (
    <FontAwesomeIcon className=" icon" icon={faUserGroup} />
  );
  const video = <FontAwesomeIcon className=" icon" icon={faVideo} />;
  const videoSlash = <FontAwesomeIcon className=" icon" icon={faVideoSlash} />;
  const mic = <FontAwesomeIcon className=" icon" icon={faMicrophone} />;
  const micSlash = (
    <FontAwesomeIcon className=" icon" icon={faMicrophoneSlash} />
  );

  return (
    <>
      <main id="room">
        <div className="videos">
          <video
            className="video"
            autoPlay
            ref={(ref) => (ref ? (ref.srcObject = myStream) : null)}
            muted
          ></video>
          {remoteStreams.map((remoteStream, index) => (
            <video
              className="video"
              key={index + 10}
              ref={(ref) =>
                ref ? (ref.srcObject = remoteStream.remoteStream) : null
              }
              autoPlay
            />
          ))}
        </div>

        <ShareBox
          isShareBoxOpen={isShareBoxOpen}
          meetingId={meetingId}
          copy={copy}
        />

        <ParticipantsBox
          isParticipantsBoxOpen={isParticipantsBoxOpen}
          participants={participants}
        />

        <div className="tool-box">
          <Tooltip id="tools-tooltip" />

          <div
            className="video-button"
            data-tooltip-id="tools-tooltip"
            data-tooltip-content={"Video"}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? video : videoSlash}
          </div>

          <div
            className="mic-button"
            data-tooltip-id="tools-tooltip"
            data-tooltip-content={"Microphone"}
            onClick={() => setIsMicOn(!isMicOn)}
          >
            {isMicOn ? mic : micSlash}
          </div>

          <div
            className="share-button"
            data-tooltip-id="tools-tooltip"
            data-tooltip-content={"Share"}
            onClick={() => setIsShareBoxOpen(!isShareBoxOpen)}
          >
            {share}
          </div>

          <div
            className="participants-button"
            data-tooltip-id="tools-tooltip"
            data-tooltip-content={"Participants"}
            onClick={getParticipants}
          >
            {participantsIcon}
          </div>

          <div
            className="sms-button"
            data-tooltip-id="tools-tooltip"
            data-tooltip-content={"Chat"}
            onClick={openChatBox}
          >
            {messageIndicator && <div className="sms-indicator"></div>}
            {sms}
          </div>

          <div
            className="end-call"
            data-tooltip-id="tools-tooltip"
            data-tooltip-content={"End call"}
            onClick={handleEndCall}
          >
            {phone}
          </div>
        </div>

        {/* chat box */}

        <div className={`chat-box ${isChatBoxOpen ? " chat-box-active" : ""} `}>
          <div className="messages">
            {messages.length == 0 ? (
              <span>No messages available</span>
            ) : (
              messages.map((v, i) => <li key={i}>{v}</li>)
            )}
          </div>
          <form className="chat-box-inputs" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>

        {/* chat box */}
      </main>
    </>
  );
};

export default Room;
