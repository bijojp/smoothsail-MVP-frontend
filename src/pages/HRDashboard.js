import { useState } from "react";
import { User, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ text, active, onClick, Icon }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100 ${active ? "bg-blue-200" : ""}`} onClick={() => onClick(text)}>
    <Icon size={24} className="text-gray-500" />
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function HRDashboard() {
  const [selectedItem, setSelectedItem] = useState("Joinees");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout functionality
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] h-screen p-6 border-r shadow-md bg-white flex flex-col justify-between">
        <div>
          {/* Profile Button */}
          <button className={`flex items-center space-x-3 w-full p-3 rounded-lg text-lg font-bold shadow-md ${selectedItem === "Profile" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} mb-8`} onClick={() => setSelectedItem("Profile")}>
            <User size={24} />
            <span>HR Name</span>
          </button>

          {/* Sidebar Items */}
          <SidebarItem
            text="Joinees"
            active={selectedItem === "Joinees"}
            onClick={setSelectedItem}
            Icon={Users} // Adding Users icon here
          />
        </div>

        {/* Log Out Button */}
        <button onClick={handleLogout} className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          <LogOut size={22} />
          <span className="text-lg font-semibold">Log Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-auto p-6">
        <h1 className="text-3xl font-bold mb-4">HR Dashboard</h1>
        {selectedItem === "Joinees" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Joinees List</h2>
            <p>Joinee details will be displayed here. Add data fetching and logic later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;
