import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { MdOutlineCancel } from "react-icons/md";


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
                        <Box sx={{ width: '100%' }}>

                        </Box>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}