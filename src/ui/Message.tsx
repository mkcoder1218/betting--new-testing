import React from "react";

interface MessageProp {
  text: string;
}
const Message: React.FC<MessageProp> = ({ text }) => {
  return (
    <div
      className="Message capitalize text-black w-full"
      style={{ color: "black !important" }}
    >
      <p>{text}</p>
    </div>
  );
};

export default Message;
