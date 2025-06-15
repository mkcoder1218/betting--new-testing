import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { authUser } from "../features/slices/userSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = (e: FormEvent) => {
    e.preventDefault();
    dispatch(authUser(username, password, navigate));
  };

  useEffect(() => {
    if (userData.user) {
      navigate("/index.html/home");
    }
  }, [userData]);

  return (
    <div className="bg-white flex items-center justify-center">
      <div
        style={{ width: "15%" }}
        className="bg-white border-2 shadow-2xl shadow-green-500 mt-12 pt-4 pl-2 pr-2 pb-4 rounded-2xl"
      >
        <div className="text-2xl mb-4 text-center text-green-600">
          Cashier Login
        </div>
        <div>
          <form
            onSubmit={handleAuth}
            className="flex flex-col gap-3 items-center justify-center"
          >
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="border border-green-500 w-4/5 rounded-md p-2 text-sm mt-3"
              type="text"
              placeholder="Username"
              maxLength={20}
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="border border-green-500 w-4/5 rounded-md p-2 text-sm"
              type="password"
              placeholder="Password"
              maxLength={30}
              required
            />
            {!userData.loading && userData?.error && (
              <p className="error shadow-sm shadow-red-400 rounded-sm bg-red-500 text-white p-1 text-sm w-full">
                {userData?.error}
              </p>
            )}
            <button
              type="submit"
              className="p-2 pl-4 pr-4 cursor-pointer text-white rounded-md text-sm bg-green-600 hover:bg-green-400 transition-all"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
