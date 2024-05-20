import { MdOutlineCancel } from "react-icons/md";

interface FormProps {
    type: string;
    content: string
}

const FormStatus = ({ type, content }: FormProps) => {
    return (
        <div className={`p-1 pl-4 pr-4 w-3/4 shadow-md shadow-slate-400 flex items-center justify-between mt-2 mb-2 text-white ${type === "error" ? 'bg-red-500' : 'bg-green-500'} `}>
            {content}
            <MdOutlineCancel className="text-white cursor-pointer" size={20} />
        </div>
    )
}

export default FormStatus;