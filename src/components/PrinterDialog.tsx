import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch } from "../features/hooks";
import { logoutUser } from "../features/slices/userSlice";

interface DialogInterface {
  handleClose: () => void;
  open: boolean;
  logout: () => void;
}

export default function PrinterDialog({
  handleClose,
  open,
  logout,
}: DialogInterface) {
  return (
    <Dialog
      className="w-full"
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ padding: 8 }}
        className="bg-green-500 p-0 flex justify-end"
        id="alert-dialog-title"
      >
        <IoMdClose
          onClick={handleClose}
          className="text-gray-300 cursor-pointer"
        />
      </DialogTitle>
      <DialogContent className="bg-white">
        <DialogContentText
          style={{ lineHeight: "1.4em", fontSize: "14px" }}
          id="alert-dialog-description"
          className="p-2 text-black text-xs space-y-0"
        >
          We cannot connect to the retail manager. The retail manager needs to
          be running for the retail system to work. Please reload after you have
          started the retail manager. You can download the retail manager from{" "}
          <a
            href="https://www.dropbox.com/scl/fo/sc6jd9vkk7bf28vao6n1o/AFD1nH9gJeJ1_K7QI3Wq9Rk?rlkey=9u1s9qkyp9o2grrd0i5pyx1ap&e=3&st=aipgkavp&dl=1"
            className="text-green-500 cursor-pointer"
          >
            here
          </a>
        </DialogContentText>
        <div className="flex items-center justify-center">
          <button
            onClick={logout}
            className="bg-gray-200 pl-2 pr-2 pt-1 pb-1 mt-2 text-sm rounded-md"
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
