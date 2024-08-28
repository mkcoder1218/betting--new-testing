interface SlipProps {
  selected: number;
  maxWin: number;
}

export default function SlipItem({ selected, maxWin }: SlipProps) {
  return (
    <div
      className="slip-head text-sm border-b-2 pl-8 pr-8 text-black flex justify-between items-center p-1 ml-3 mr-5"
      style={{ backgroundColor: "#D5EED9" }}
    >
      <span>{selected}</span>
      <span>{maxWin}</span>
    </div>
  );
}
