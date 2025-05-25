import { MdOutlineCancel } from "react-icons/md";

interface FormProps {
    type: string;
    content: string
}

const FormStatus = ({ type, content }: FormProps) => {
    return (
        <div className={`p-0.5 pl-4 pr-4 w-[90%] flex justify-center font-light  shadow-slate-400  mt-2 mb-2 text-white ${type === "error" ? 'bg-red-500' : 'successful'} `}>
            {content?.charAt(0)?.toUpperCase() + content?.slice(1)}
           
        </div>
    )
}

export default FormStatus;