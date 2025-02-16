import { useState } from "react";
import { CheckCircle, Hourglass, User, LogOut, Loader2 } from "lucide-react";

const SidebarItem = ({ text, completed, active, onClick }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100`} onClick={() => onClick(text)}>
    {active ? <Loader2 className="text-amber-500 animate-spin" size={22} /> : completed ? <CheckCircle className="text-green-500" size={22} /> : <Hourglass className="text-orange-500" size={22} />}
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function NewHireDashboard() {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedItem) {
      case "Profile":
        return (
          <div className="p-6 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold">Full Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block font-semibold">Email</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block font-semibold">Password</label>
                <input type="password" className="w-full p-2 border rounded" placeholder="Enter new password" />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
            </div>
          </div>
        );
      case "Offer Letter":
        return (
          <div className="p-6 bg-white shadow-md rounded">
            <h1 className="text-3xl font-bold">Offer Letter</h1>
            <p className="mt-2 text-gray-600">Here is your offer letter:</p>
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <p className="text-sm text-gray-700">Dear [New Hire],</p>
              <p className="text-sm text-gray-700">We are pleased to offer you the position of [Job Title] at [Company Name]. Your starting salary will be [Salary]. Please review and accept the offer below.</p>
            </div>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Accept Offer</button>
          </div>
        );
      case "My Documents":
      case "Onboarding":
      case "Access":
        return (
          <div className="p-6 bg-white shadow-md rounded">
            <h1 className="text-3xl font-bold">{selectedItem}</h1>
            <p className="mt-2 text-gray-600">Details about {selectedItem} will be displayed here.</p>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-white shadow-md rounded">
            <h1 className="text-3xl font-bold">New Hire Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your onboarding journey!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <div className="w-64 h-screen p-6 border-r shadow-md bg-white flex flex-col justify-between">
        <div>
          {/* Profile Button */}
          <button className={`flex items-center space-x-3 w-full p-3 rounded-lg text-lg font-bold shadow-md ${selectedItem === "Profile" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} mb-8`} onClick={() => setSelectedItem("Profile")}>
            <User size={24} />
            <span>Profile</span>
          </button>

          {/* Sidebar Items */}
          <SidebarItem text="Offer Letter" completed={false} active={selectedItem === "Offer Letter"} onClick={setSelectedItem} />
          <SidebarItem text="My Documents" completed={true} active={selectedItem === "My Documents"} onClick={setSelectedItem} />
          <SidebarItem text="Onboarding" completed={false} active={selectedItem === "Onboarding"} onClick={setSelectedItem} />
          <SidebarItem text="Access" completed={true} active={selectedItem === "Access"} onClick={setSelectedItem} />
        </div>

        {/* Log Out Button */}
        <button className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          <LogOut size={22} />
          <span className="text-lg font-semibold">Log Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-auto p-6">{renderContent()}</div>
    </div>
  );
}

export default NewHireDashboard;
