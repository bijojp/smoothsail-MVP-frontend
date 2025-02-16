import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === "new-hire") {
      navigate("/new-hire");
    } else if (role === "hr") {
      navigate("/hr");
    } else if (role === "it-admin") {
      navigate("/it-admin");
    }
  };

  return (
    <div className="flex flex-col items-start min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-6 ml-4">Welcome to SmoothSail</h1>

      <div className="flex space-x-4 items-end justify-end">
        {" "}
        {/* Use flex and horizontal spacing */}
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
