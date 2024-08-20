import React, { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GenerateOption from "../../utils/GenerateOption";

interface FirstMiniProp {
  gameId?: any;
  gameNumber?: any;
  gameIdofBack?:string
}
function Fifthmini(prop: FirstMiniProp) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoverdclass, sethoverdclass] = useState("hovergreen");

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight
    ) {
      loadMoreItems();
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: -800,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: 800,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fifthmini_container h-1/3 w-99p overflow-hidden">
      <div className="child_mini flex flex-col w-full overflow-hidden gap-5 h-full items-start justify-center">
        <p className="text-xl">Neighbors</p>
        <div
          className="mini_numbers overflow-x-scroll w-full mb-4"
          style={{ height: "30%" }}
          ref={scrollContainerRef}
        >
          {GenerateOption(
            "span",
            0,
            37,
            hoverdclass,
            prop.gameId,
            prop.gameNumber,

            sethoverdclass
          )}
        </div>
        <div className="icons">
          <ChevronLeftIcon onClick={scrollLeft} />
          <ChevronRightIcon onClick={scrollRight} />
        </div>
        <div className="min"></div>
      </div>
    </div>
  );
}

export default Fifthmini;
