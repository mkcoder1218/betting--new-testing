import { useNavigate } from "react-router-dom"


export default function Login() {

    const navigate = useNavigate();

    const authHandler = () => {
        navigate("/home");
    }

    return (
        <div className="bg-white flex items-center justify-center">
            <div className="w-1/4 bg-white border-2 border-slate-300 shadow-xl shadow-green-300 mt-10 p-10 rounded-2xl">
                <div className="text-2xl text-center text-green-600 font-bold">
                    Cashier Login
                </div>
                <div>
                    <form onSubmit={authHandler} className="flex flex-col gap-3 items-center justify-center">
                        <input className="border border-green-500 w-2/3 rounded-md p-1 text-sm mt-3" type="text" placeholder="Username" maxLength={20} />
                        <input className="border border-green-500 w-2/3 rounded-md p-1 text-sm" type="password" placeholder="Password" maxLength={30} />
                        <button type="submit" className="p-2 pl-4 pr-4 cursor-pointer text-white rounded-sm bg-green-600 hover:bg-green-400 transition-all">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}