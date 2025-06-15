import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { authUser } from "../features/slices/userSlice";
import { SmallProgressCircular } from "../components/ProgressCircular";
import { BsXCircle } from "react-icons/bs";

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
    <div className="bg-white flex relative justify-center ">
              <div className="absolute z-[10] min-w-[800px] top-[80%] !max-h-[50px]" style={{boxShadow: "0 100px 150px 150px rgba(34, 197, 94, 0.2)"}}></div>

      <div
        style={{ 
          width: "90%", 
          maxWidth: "250px", 
          marginTop: "2%",
          boxShadow: "0 0px 10px 5px rgba(34, 197, 94, 0.2)"
        }}
        className="bg-white border-2 border-green-100 z-[500]  pt-4 pl-2 pr-2 pb-4 rounded-2xl"
      >
        <div className="text-[30px] mb-4 text-center text-[#37b34a]">
          Cashier Login
        </div>
        {!userData.loading && userData?.error && (
              <p className="error shadow-sm shadow-red-400 flex gap-1  border border-red-500/20 bg-red-500 text-white p-2 rounded-md text-sm w-full">
                <BsXCircle className="w-4 h-4" />
                {userData?.error?.includes("Invalid")||userData?.error?.includes("User not found") ? "Invalid username or password" : userData?.error}
              </p>
            )}
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
           
            <button
              type="submit"
              className="p-2 pl-4 pr-4 cursor-pointer text-white rounded-md text-sm bg-green-600 hover:bg-green-400 transition-all"
            >
              {userData.loading ? (
                <div style={{ display: "flex" }}>
                  <p
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      marginLeft: "5%",
                    }}
                  >
                    Loading...
                  </p>
                </div>
              ) : (
                "Enter"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
