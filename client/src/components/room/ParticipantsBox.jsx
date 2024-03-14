import React from "react";

const ParticipantsBox = ({ isParticipantsBoxOpen, participants }) => {
  return (
    <>
      <div
        className={`participants-box ${
          isParticipantsBoxOpen ? "participants-box-active" : ""
        }`}
      >
        {participants ? (
          participants.length == 1 ? (
            <h3>{participants.length} user are online 🟢</h3>
          ) : (
            <h3>{participants.length} users are online 🟢</h3>
          )
        ) : (
          ""
        )}
        {participants
          ? participants.map((v, i) => <li key={i}>{v.name}</li>)
          : ""}
      </div>
    </>
  );
};

export default ParticipantsBox;
