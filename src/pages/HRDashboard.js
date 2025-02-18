import { useState, useEffect } from "react";
import { User, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firestore data fetching

const SidebarItem = ({ text, active, onClick, Icon }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100 ${active ? "bg-blue-200" : ""}`} onClick={() => onClick(text)}>
    <Icon size={24} className="text-gray-500" />
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function HRDashboard() {
  const [selectedItem, setSelectedItem] = useState("Joinees");
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout functionality
    navigate("/"); // Redirect to login page after logout
  };

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            fullName: doc.data().fullName || "Unnamed User", // Accessing fullName
            role: doc.data().role,
            status: doc.data().status,
            joiningDate: doc.data().joiningDate || "N/A", // Fetching joiningDate
          }))
          .filter((user) => user.role === "new-hire" && user.status === "pre"); // Only keep new-hire users with "pre" status

        // Log the fetched data to check
        console.log(usersList);

        setUserData(usersList);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to format the date as DD/MM/YY
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-GB"); // Returns date in DD/MM/YY format
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
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white shadow-md rounded">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border w-40 text-left">Joining Date</th> {/* Left-aligned heading */}
                    <th className="px-4 py-2 border">Full Name</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border">{user.joiningDate !== "N/A" ? formatDate(user.joiningDate) : "N/A"}</td> {/* Formatting Joining Date */}
                      <td className="px-4 py-2 border">{user.fullName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;
