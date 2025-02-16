import { useState } from "react";
import { CheckCircle, Hourglass, User, LogOut, Loader2 } from "lucide-react";
import { auth } from "../firebase"; // Adjust path based on your folder structure
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import ProfileForm from "./ProfileForm"; // Adjust path if needed

const SidebarItem = ({ text, completed, active, onClick }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100`} onClick={() => onClick(text)}>
    {active ? <Loader2 className="text-amber-500 animate-spin" size={22} /> : completed ? <CheckCircle className="text-green-500" size={22} /> : <Hourglass className="text-orange-500" size={22} />}
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function NewHireDashboard() {
  const [selectedItem, setSelectedItem] = useState("Offer Letter");

  // State to track completion status of items
  const [completedItems, setCompletedItems] = useState({
    "Offer Letter": false,
    "About Me": false,
    "My Documents": false,
    Onboarding: false,
    Access: false,
  });

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAcceptOffer = () => {
    // Mark "Offer Letter" as completed when the button is clicked
    setCompletedItems((prevState) => ({
      ...prevState,
      "Offer Letter": true,
    }));

    // Automatically move to "About Me" section
    setSelectedItem("About Me");
  };

  const handleSubmitProfile = () => {
    // Mark "About Me" as completed when the form is submitted
    setCompletedItems((prevState) => ({
      ...prevState,
      "About Me": true,
    }));

    // Move to the "My Documents" section
    setSelectedItem("My Documents");
  };

  const handleUploadDocuments = () => {
    // Mark "My Documents" as completed when the upload is done
    setCompletedItems((prevState) => ({
      ...prevState,
      "My Documents": true,
    }));

    // Move to the "Onboarding" section
    setSelectedItem("Onboarding");
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Profile":
        return (
          <div className="p-6 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <div className="space-y-4">
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
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleAcceptOffer} // Update completion when clicked
            >
              Accept Offer
            </button>
          </div>
        );
      case "About Me":
        return <ProfileForm onSubmit={handleSubmitProfile} />; // Pass the function to handle "submit"
      case "My Documents":
        return (
          <div className="p-6 bg-white shadow-md rounded">
            <h1 className="text-3xl font-bold">Upload Required Documents</h1>
            <p className="mt-2 text-gray-600">Please upload the following required documents for onboarding:</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Government ID (e.g., Passport, Driver's License)</label>
                <input type="file" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Proof of Address</label>
                <input type="file" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Educational Certificates</label>
                <input type="file" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Previous Employment Proof</label>
                <input type="file" className="w-full p-2 border rounded" />
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleUploadDocuments} // Update completion when clicked
            >
              Upload
            </button>
          </div>
        );

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
      <div className="w-64 min-w-[16rem] h-screen p-6 border-r shadow-md bg-white flex flex-col justify-between">
        <div>
          {/* Profile Button */}
          <button className={`flex items-center space-x-3 w-full p-3 rounded-lg text-lg font-bold shadow-md ${selectedItem === "Profile" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} mb-8`} onClick={() => setSelectedItem("Profile")}>
            <User size={24} />
            <span>Profile</span>
          </button>

          {/* Sidebar Items */}
          <SidebarItem text="Offer Letter" completed={completedItems["Offer Letter"]} active={selectedItem === "Offer Letter"} onClick={setSelectedItem} />
          <SidebarItem text="About Me" completed={completedItems["About Me"]} active={selectedItem === "About Me"} onClick={setSelectedItem} />
          <SidebarItem text="My Documents" completed={completedItems["My Documents"]} active={selectedItem === "My Documents"} onClick={setSelectedItem} />
          <SidebarItem text="Onboarding" completed={completedItems["Onboarding"]} active={selectedItem === "Onboarding"} onClick={setSelectedItem} />
          <SidebarItem text="Access" completed={completedItems["Access"]} active={selectedItem === "Access"} onClick={setSelectedItem} />
        </div>

        {/* Log Out Button */}
        <button onClick={handleLogout} className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
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
