import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="flex flex-col justify-between min-h-screen p-6 bg-gray-100">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Welcome to SmoothSail</h1>

      {/* Login Form */}
      <div className="flex justify-end">
        <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button onClick={() => handleLogin("new-hire")} className="px-4 py-2 bg-blue-500 text-white rounded">
          New Hire
        </button>
        <button onClick={() => handleLogin("hr")} className="px-4 py-2 bg-green-500 text-white rounded">
          HR
        </button>
        <button onClick={() => handleLogin("it-admin")} className="px-4 py-2 bg-purple-500 text-white rounded">
          IT Admin
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
