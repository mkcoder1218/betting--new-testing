const generate = (number: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i <= number; i++) {
    result.push(i);
  }
  return result;
};

export function formatNumberWithCommas(num: number): string {
  const [integerPart, decimalPart] = num.toFixed(2).split(".");

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  return `${formattedIntegerPart}.${decimalPart}`;
}

export default generate;
