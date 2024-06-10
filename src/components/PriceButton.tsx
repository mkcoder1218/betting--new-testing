
interface PriceProps {
    changeIndividualStake: (val: number, index: number) => void,
    index: number
}

export default function PriceButton({ changeIndividualStake, index }: PriceProps) {
    return (
        <div className='btn-container-bet w-full p-1 flex gap-2 justify-stretch items-center'>
            <button style={{ backgroundColor: "#C9580F" }} onClick={() => changeIndividualStake(index, 10)} className='hover:opacity-75 transition-all flex-grow rounded-md flex p-2 text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">10</span></button>
            <button style={{ backgroundColor: "#C93362" }} onClick={() => changeIndividualStake(index, 20)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">20</span></button>
            <button style={{ backgroundColor: "#8830AD" }} onClick={() => changeIndividualStake(index, 50)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">50</span></button>
            <button style={{ backgroundColor: "#5A95F0" }} onClick={() => changeIndividualStake(index, 100)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">100</span></button>
            <button style={{ backgroundColor: "#688A37" }} onClick={() => changeIndividualStake(index, 150)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">150</span></button>
        </div>

    )
}