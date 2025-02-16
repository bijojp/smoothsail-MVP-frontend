import { useState } from "react";
import { CheckCircle, Hourglass, User, LogOut } from "lucide-react";

const SidebarItem = ({ text, completed, active, onClick }) => (
  <div className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg ${active ? "bg-blue-200" : "hover:bg-gray-100"}`} onClick={() => onClick(text)}>
    {completed ? <CheckCircle className="text-green-500" size={20} /> : <Hourglass className="text-orange-500" size={20} />}
    <h1 className="text-xl font-semibold">{text}</h1>
  </div>
);

function NewHireDashboard() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const renderContent = () => (
    <div className="mt-4 p-4 bg-white shadow rounded">
      <h1 className="text-3xl font-bold">{selectedItem}</h1>
      <p>Content for {selectedItem} will be displayed here.</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <div className="w-60 h-screen p-4 border-r shadow-md border-gray-300 flex flex-col justify-between bg-white">
        <div>
          {/* Profile Button */}
          <button
            className={`flex items-center space-x-2 w-full p-3 rounded-lg text-lg font-bold shadow-md ${selectedItem === "Profile" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} mb-6`} // Added spacing below profile button
            onClick={() => setSelectedItem("Profile")}
          >
            <User size={24} />
            <span>Profile</span>
          </button>

          {/* Sidebar Items */}
          <div className="space-y-4">
            <SidebarItem text="Offer Letter" completed={false} active={selectedItem === "Offer Letter"} onClick={setSelectedItem} />
            <SidebarItem text="My Documents" completed={true} active={selectedItem === "My Documents"} onClick={setSelectedItem} />
            <SidebarItem text="Onboarding" completed={false} active={selectedItem === "Onboarding"} onClick={setSelectedItem} />
            <SidebarItem text="Access" completed={true} active={selectedItem === "Access"} onClick={setSelectedItem} />
          </div>
        </div>

        {/* Log Out Button */}
        <button className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          <LogOut size={20} />
          <span className="text-lg font-semibold">Log Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-auto p-6">{renderContent()}</div>
    </div>
  );
}

export default NewHireDashboard;
