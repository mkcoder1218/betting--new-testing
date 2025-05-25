import React, { useEffect } from "react";

interface NetworkErrorComponentProps {
  show: boolean;
  onReload: () => void;
}

export const NetworkErrorComponent: React.FC<NetworkErrorComponentProps> = ({
  show,
  onReload,
}) => {
  if (!show) {
    return null;
  }

  return (
    <center>
      {" "}
      <div className="network-error-container">
        <p className="error-message">
          Something went wrong with your connection.
        </p>
        <button className="reload-button" onClick={onReload}>
          Refresh
        </button>

        <style jsx>{`
          .network-error-container {
            z-index: 1000; /* Ensure it's above most UI elements */
            background-color: rgba(13, 255, 0, 0.1);
            text-align: center;
            padding: 20px;
            border: 1px solid rgb(80, 211, 47);
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .error-message {
            font-size: 1rem;
            color: rgb(96, 211, 47);
            font-weight: bold;
            margin-bottom: 10px;
          }

          .reload-button {
            padding: 10px 20px;
            background-color: rgb(61, 205, 35);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.3s ease;
          }

          .reload-button:hover {
            background-color: rgb(70, 159, 32);
          }
        `}</style>
      </div>
    </center>
  );
};

export default NetworkErrorComponent;
