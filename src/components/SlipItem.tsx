interface SlipProps {
  selected: number;
  maxWin: number;
}

export default function SlipItem({ selected, maxWin }: SlipProps) {
  const formatNumber = (value: string) => {
    const number = parseFloat(value);

    // If the number is NaN (invalid number), return the original value
    if (isNaN(number)) return value;

    // Round to one decimal place and remove trailing zeros
    return parseFloat(number.toFixed(1));
  };
  return (
    <div
      className="slip-head text-sm border-b-2 pl-8 pr-8 text-black flex justify-between items-center p-1 ml-3 mr-5"
      style={{ backgroundColor: "#D5EED9" }}
    >
      <span>{selected}</span>
      <span>{formatNumber(maxWin + "")}</span>
    </div>
  );
}
