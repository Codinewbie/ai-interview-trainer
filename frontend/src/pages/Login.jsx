import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home"); // redirect after login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in");
    }
  };

  return (
    <div className="min-h-screen bg-[#101c24]">
      <Header/>
      <div className="flex mt-28 justify-center  items-center">
      <form onSubmit={handleLogin} className="bg-[#28344c] p-8 rounded shadow-md w-96">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">Login</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border-[#2e4f6b]  bg-[#4c647c] text-sm mb-4 rounded"
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border-[#2e4f6b]  bg-[#4c647c] text-sm mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#369eff] p-2 text-[#0f1924] rounded-xl px-3 text-sm font-bold transition"
        >
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;
