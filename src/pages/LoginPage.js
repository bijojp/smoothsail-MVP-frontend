import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import homePic from "../assets/homePic.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError(""); // Clear errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.email));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        navigate(`/${role}`);
      } else {
        setError("User role not found!");
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
    }
  };

  const handleRoleNavigation = (role) => {
    navigate(`/${role}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between min-h-screen p-6 bg-gray-100">
      {/* Image Section */}
      <div className="flex-1 flex justify-center items-center">
        <img src={homePic} alt="Home" className="max-w-full h-auto rounded-lg shadow-lg" />
      </div>

      {/* Login Section */}
      <div className="flex-1 flex flex-col justify-center items-end">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6">Welcome to SmoothSail</h1>

        {/* Login Form */}
        <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="h-6 text-red-500 text-sm mb-2">{error && <span>{error}</span>}</div>
          <button onClick={handleLogin} className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </div>

        {/* Quick Navigation for Testing */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={() => handleRoleNavigation("new-hire")} className="px-4 py-2 bg-blue-500 text-white rounded">
            New Hire
          </button>
          <button onClick={() => handleRoleNavigation("hr")} className="px-4 py-2 bg-green-500 text-white rounded">
            HR
          </button>
          <button onClick={() => handleRoleNavigation("it-admin")} className="px-4 py-2 bg-purple-500 text-white rounded">
            IT Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
