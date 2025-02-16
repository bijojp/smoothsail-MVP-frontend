import { useState } from "react";
import { CheckCircle, Hourglass } from "lucide-react";

const SidebarItem = ({ text, completed, active, onClick }) => (
  <div className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg ${active ? "bg-blue-200" : "hover:bg-gray-100"}`} onClick={() => onClick(text)}>
    {completed ? <CheckCircle className="text-green-500" size={20} /> : <Hourglass className="text-orange-500" size={20} />}
    <h1 className="text-xl font-semibold">{text}</h1>
  </div>
);

function NewHireDashboard() {
  const [selectedItem, setSelectedItem] = useState("Offer Letter");

  const renderContent = () => {
    switch (selectedItem) {
      case "Offer Letter":
        return <p>This is the Offer Letter section.</p>;
      case "My Documents":
        return <p>Upload and manage your documents here.</p>;
      case "Onboarding":
        return <p>Complete your onboarding tasks.</p>;
      case "Access":
        return <p>Manage system access and credentials.</p>;
      default:
        return <p>Select a section to view details.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-100">
      {/* Sidebar */}
      <div className="w-60 h-screen p-4 border-r shadow-md border-gray-300 flex flex-col space-y-4 bg-white">
        <SidebarItem text="Offer Letter" completed={false} active={selectedItem === "Offer Letter"} onClick={setSelectedItem} />
        <SidebarItem text="My Documents" completed={true} active={selectedItem === "My Documents"} onClick={setSelectedItem} />
        <SidebarItem text="Onboarding" completed={false} active={selectedItem === "Onboarding"} onClick={setSelectedItem} />
        <SidebarItem text="Access" completed={true} active={selectedItem === "Access"} onClick={setSelectedItem} />
      </div>

      {/* Main Content */}
      <div className="flex-auto p-6">
        <h1 className="text-3xl font-bold">New Hire Dashboard</h1>
        <div className="mt-4 p-4 bg-white shadow rounded">{renderContent()}</div>
      </div>
    </div>
  );
}

export default NewHireDashboard;
