import React, { useState } from "react";

const TestComponent = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div>
      {[0, 1, 2, 3, 4].map((i) => (
        <p
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          style={{
            margin: "10px",
            padding: "20px",
            border: "1px solid black",
            backgroundColor: hoverIndex === i ? "lightblue" : "white",
            cursor: "pointer",
          }}
        >
          Item {i}
        </p>
      ))}
    </div>
  );
};

export default TestComponent;
