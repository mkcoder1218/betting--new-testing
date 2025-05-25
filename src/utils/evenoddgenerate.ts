export function generateEvenAndOddArrays(start: number, end: number) {
    const evens: number[] = [];
    const odds: number[] = [];

    for (let i = start; i <= end; i++) {
        if (i % 2 === 0) {
            evens.push(i);
        } else {
            odds.push(i);
        }
    }

    return { evens, odds };
}