import React from "react";
import { Tooltip } from "react-tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ShareBox = ({ isShareBoxOpen, meetingId, copy }) => {
  return (
    <>
      <div className={`share-box ${isShareBoxOpen ? "share-box-active" : ""} `}>
        <Tooltip id="share-tooltip" />
        <p>Share your meeting id</p>
        <input type="text" value={meetingId} readOnly />
        <CopyToClipboard className="clipboard" text={meetingId}>
          <button
            data-tooltip-id="share-tooltip"
            data-tooltip-content={"copy to clipboard"}
          >
            {copy}
          </button>
        </CopyToClipboard>
      </div>
    </>
  );
};

export default ShareBox;
