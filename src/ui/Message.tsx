import React from "react";

interface MessageProp {
  text: string;
}
const Message: React.FC<MessageProp> = ({ text }) => {
  return (
    <div className="Message">
      <p>{text}</p>
    </div>
  );
};

export default Message;
