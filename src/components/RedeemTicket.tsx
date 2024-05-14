import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { MdOutlineCancel } from "react-icons/md";
import NumberPad from './NumberPad';


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

export default function RedeemTicket({ open, handleClose, type }: RedeemTicketProps) {
    const [value, setValue] = React.useState('');

    const handleEnter = (input: any) => {
        console.log('Entered:', input);
    };

    const handleClear = () => {
        console.log('Cleared');
    };

    const handleDelete = () => {
        console.log('Deleted');
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='cashier-options-header flex justify-between items-center p-3 bg-amber-500 rounded-tl-lg rounded-tr-lg'>
                        <p className='text-white font-bold text-lg'>{type === "redeem" ? "Redeem Betslip" : "Cancel Betslip"}</p>
                        <MdOutlineCancel onClick={handleClose} size={24} className='text-black' />
                    </div>
                    <div className='options-content bg-white p-6'>
                        <Box>
                            <div className=''>
                                <p>Enter betslip code or scan</p>
                                <input maxLength={20} style={{ width: "40%" }} type="text" className='p-2 mt-3 border border-slate-500 bg-white rounded-md' placeholder='betslip code' />
                            </div>
                            <NumberPad onEnter={handleEnter} onClear={handleClear} onDelete={handleDelete} />
                        </Box>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}