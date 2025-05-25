import React, { memo } from "react";

interface MessageProp {
  text: string;
}
const Message: React.FC<MessageProp> = ({ text }) => {
  return (
    <div
      className="Message capitalize text-black !text-sm font-light w-full"
      style={{ color: "black !important" }}
    >
      <span>{text}</span>
    </div>
  );
};

export default memo(Message);
