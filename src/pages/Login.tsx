import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { authUser } from "../features/slices/userSlice";


export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userData = useAppSelector(state => state.user)

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = (e: FormEvent) => {
        e.preventDefault();
        dispatch(authUser(username, password, navigate));
    }

    useEffect(() => {
        if (userData.user) {
            navigate("/home")
        }
    }, [])

    return (
        <div className="bg-white flex items-center justify-center">
            <div className="w-1/4 bg-white border-2 border-slate-300 shadow-xl shadow-green-300 mt-10 p-10 rounded-2xl">
                <div className="text-2xl text-center text-green-600 font-bold">
                    Cashier Login
                </div>
                <div>
                    <form onSubmit={handleAuth} className="flex flex-col gap-3 items-center justify-center">
                        <input onChange={(e) => setUsername(e.target.value)} className="border border-green-500 w-3/4 rounded-md p-2 text-sm mt-3" type="text" placeholder="Username" maxLength={20} required />
                        <input onChange={(e) => setPassword(e.target.value)} className="border border-green-500 w-3/4 rounded-md p-2 text-sm" type="password" placeholder="Password" maxLength={30} required />
                        {(!userData.loading && userData?.error) && <p className="error shadow-sm shadow-red-400 rounded-sm bg-red-500 text-white p-1 text-sm w-full">
                            {userData?.error}
                        </p>}
                        <button type="submit" className="p-2 pl-4 pr-4 cursor-pointer text-white rounded-sm bg-green-600 hover:bg-green-400 transition-all">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}