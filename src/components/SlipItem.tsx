

interface SlipProps {
    selected: number,
    maxWin: number
}

export default function SlipItem({ selected, maxWin }: SlipProps) {
    return (
        <div className='slip-head text-sm border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
            <span>{selected}</span>
            <span>{maxWin}</span>
        </div>
    )
}