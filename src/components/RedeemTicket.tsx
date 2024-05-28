import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { MdOutlineCancel } from "react-icons/md";
import NumberPad from './NumberPad';
import BetSlipTable from './BetSlipTable';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { getTicketsToCancel, getTicketsToRedeem } from '../features/slices/betData';
import ProgressCircular from './ProgressCircular';
import FormStatus from './FormStatus';
import Dynamsoft, { TextResult } from 'dynamsoft-javascript-barcode';

interface RedeemTicketProps {
    open: boolean,
    type: string,
    handleClose: () => void
}

const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "86%",
    margin: "auto",
    height: '500px',
    overflow: "auto",
    borderRadius: "10px",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 0,
};

const deviceConfiguration = {
    deviceType: 'USB',
    deviceId: '04e9:8190', // Example USB vendor and product IDs
    communicationType: 'HID', // Common communication protocol for USB barcode scanners
};

export default function RedeemTicket({ open, handleClose, type }: RedeemTicketProps) {
    const dispatch = useAppDispatch();

    const [betslip, setSlip] = React.useState('');
    const [data, setData] = React.useState("Not Found");
    const [barcodeSubmit, toggleBarcode] = useState(false);
    const betSlipData = useAppSelector(state => state.betData)
    const listOfNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    const handleInput = (input: number | null, action: string) => {
        if (action === "add" && input !== null && listOfNums.includes(input) && betslip.length <= 20) {
            setSlip(prevEl => prevEl + input.toString());
        }

        if (action === "remove") {
            const values = betslip.split("");
            values.pop();
            let newVal = values.join("");

            setSlip(newVal)
        }

        if (action === "removeAll") {
            setSlip('');
        }
    };

    const handleEnter = (input: any) => {
        if (type === "cancel") {
            dispatch(getTicketsToCancel(parseInt(betslip)))
        } else {
            dispatch(getTicketsToRedeem(parseInt(betslip)))
        }
    };

    const handleClear = () => {
        console.log('Cleared');
    };

    const handleDelete = () => {
        console.log('Deleted');
    };

    const handleBarCode = (e: React.FormEvent) => {
        console.log("submitted");
    }

    useEffect(() => {
        if (barcodeSubmit && betslip !== '') {
            handleEnter(betslip);
            toggleBarcode(false);
            setSlip('');
            console.log(betslip)
        }
    }, [barcodeSubmit])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                toggleBarcode(true);
            } else {
                if (!isNaN(parseInt(event.key))) {
                    setSlip((prevValue) => prevValue + event.key);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>

                    <div className='cashier-options-header flex justify-between items-center p-2 bg-amber-500 rounded-tl-lg rounded-tr-lg'>
                        <p className='text-white font-bold text-lg'>{type === "redeem" ? "Redeem Betslip" : "Cancel Betslip"}</p>
                        <MdOutlineCancel onClick={handleClose} size={24} className='text-black' />
                    </div>
                    <div className='options-content w-full bg-white p-6'>
                        <Box>
                            <div className='flex'>
                                <div className='w-1/3'>
                                    <form onSubmit={handleBarCode} className='w-full'>
                                        <p>Enter betslip code or scan</p>
                                        <input onChange={(e) => setSlip(e.target.value)} value={betslip} maxLength={20} type="text" className='p-2 w-full mt-3 border border-slate-500 bg-white rounded-md' placeholder='betslip code' />
                                    </form>
                                    <NumberPad onInput={handleInput} onEnter={handleEnter} onClear={handleClear} onDelete={handleDelete} />
                                </div>
                                {betSlipData.loading && <div className='w-full flex items-center justify-center'>
                                    <ProgressCircular /></div>}
                                {betSlipData.error && <div className='w-1/2 p-0 flex items-start justify-center'>
                                    <FormStatus type='error' content={betSlipData.error} />
                                </div>}
                                {(betSlipData.message && betSlipData.message !== "success") && <div className='w-1/2 p-0 flex items-start justify-center'>
                                    <FormStatus type='success' content={betSlipData.message} />
                                </div>}
                                {(!betSlipData.loading && betSlipData.data) &&
                                    <BetSlipTable data={betSlipData.data} type={type} />
                                }
                            </div>
                        </Box>
                    </div>
                </Box>

            </Modal>
        </div>
    )
}