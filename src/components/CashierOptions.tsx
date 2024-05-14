import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MdOutlineCancel } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { FaPrint } from "react-icons/fa";


interface CashierOptionsProps {
    open: boolean,
    handleClose: () => void
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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

const ProSpan = styled('span')({
    display: 'inline-block',
    height: '1em',
    width: '1em',
    verticalAlign: 'middle',
    marginLeft: '0.3em',
    marginBottom: '0.08em',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundImage: 'url(https://mui.com/static/x/pro.svg)',
});

function Label({
    componentName,
    valueType,
    isProOnly,
}: {
    componentName: string;
    valueType: string;
    isProOnly?: boolean;
}) {
    const content = (
        <span>
            <strong>{componentName}</strong> for {valueType} editing
        </span>
    );

    if (isProOnly) {
        return (
            <Stack direction="row" spacing={0.5} component="span">
                <Tooltip title="Included on Pro package">
                    <a
                        href="https://mui.com/x/introduction/licensing/#pro-plan"
                        aria-label="Included on Pro package"
                    >
                        <ProSpan />
                    </a>
                </Tooltip>
                {content}
            </Stack>
        );
    }

    return content;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className='w-full'
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function CashierOptions({ open, handleClose }: CashierOptionsProps) {

    const [value, setValue] = React.useState(0);
    const [dateVal, setDateValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
                    <div className='cashier-options-header flex justify-between items-center p-4 bg-amber-500 rounded-tl-lg rounded-tr-lg'>
                        <p className='text-white font-bold text-lg'>Cashier Options</p>
                        <MdOutlineCancel onClick={handleClose} size={24} className='text-black' />
                    </div>
                    <div className='options-content bg-white p-6'>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="tickets tab">
                                    <Tab label="Summary" style={{ textTransform: "unset" }} {...a11yProps(0)} />
                                    <Tab label="Recall Tickets" style={{ textTransform: "unset" }} {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <div className='border-2 mt-4 border-amber-300 w-full rounded-md'>
                                <CustomTabPanel value={value} index={0}>
                                    <div className='date-picker-form flex gap-6 items-end'>
                                        <div>
                                            <p className='mb-1'>From Date</p>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker
                                                        value={dateVal}
                                                        onChange={(newValue) => setDateValue(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                        <div>
                                            <p className='mb-1'>To Date</p>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker

                                                        value={dateVal}
                                                        onChange={(newValue) => setDateValue(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                        <button className='p-2 mb-2 bg-green-600 rounded-md text-white flex items-center gap-2'>Refresh <span><IoMdRefresh className='text-white' size={20} /></span></button>
                                    </div>
                                    <div className='summary-content w-full mt-4'>
                                        <table className='w-full table table-fixed'>
                                            <thead className='border-2 border-slate-300 bg-slate-300'>
                                                <tr className='text-sm p-2 table-row'>
                                                    <th className='border p-2 border-slate-400'>Print</th>
                                                    <th className='border border-slate-400'>Cashier Name</th>
                                                    <th className='border border-slate-400'>From Date</th>
                                                    <th className='border border-slate-400'>To Date</th>
                                                    <th className='border border-slate-400'>Tickets</th>
                                                    <th className='border border-slate-400'>Bets</th>
                                                    <th className='border border-slate-400'>Redeemed</th>
                                                    <th className='border border-slate-400'>Cancelled</th>
                                                    <th className='border border-slate-400'>Net Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className='text-center text-sm p-2 border border-slate-300'>
                                                    <td className='border border-slate-400 p-2 flex items-center justify-center'><FaPrint size={20} className='text-orange-500 hover:text-orange-300 transition-all' /></td>
                                                    <td className='border border-slate-400 p-2'>Cashier.One</td>
                                                    <td className='border border-slate-400 p-2'>2024-10-11</td>
                                                    <td className='border border-slate-400 p-2'>2024-10-12</td>
                                                    <td className='border border-slate-400 p-2'>3</td>
                                                    <td className='border border-slate-400 p-2'>300</td>
                                                    <td className='border border-slate-400 p-2'>50</td>
                                                    <td className='border border-slate-400 p-2'>3</td>
                                                    <td className='border border-slate-400 p-2'>5000</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <div className='date-picker-form flex gap-6 items-end'>

                                        <button className='p-2 mb-2 bg-orange-500 rounded-md text-white flex items-center gap-2'>Refresh<span><IoMdRefresh className='text-white' size={20} /></span></button>
                                    </div>
                                    <div className='summary-content w-full mt-4'>
                                        <table className='w-full table table-fixed'>
                                            <thead className='border-2 border-slate-300 bg-slate-300'>
                                                <tr className='text-sm p-2 table-row'>
                                                    <th className='border p-2 border-slate-400'>Print</th>
                                                    <th className='border border-slate-400'>Ticket Number</th>
                                                    <th className='border border-slate-400'>Cashier Name</th>
                                                    <th className='border border-slate-400'>Player Numbers</th>
                                                    <th className='border border-slate-400'>Net Stack</th>
                                                    <th className='border border-slate-400'>Win</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className='text-center text-sm p-2 border border-slate-300'>
                                                    <td className='border border-slate-400 p-2 flex items-center justify-center'><FaPrint size={20} className='text-orange-500 hover:text-orange-300 transition-all' /></td>
                                                    <td className='border border-slate-400 p-2'>000182781</td>
                                                    <td className='border border-slate-400 p-2'>Cashier.One</td>
                                                    <td className='border border-slate-400 p-2'>1,2,4,7,8</td>
                                                    <td className='border border-slate-400 p-2'>10</td>
                                                    <td className='border border-slate-400 p-2'>5000</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CustomTabPanel>
                            </div>

                        </Box>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}