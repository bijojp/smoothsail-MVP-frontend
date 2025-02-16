import { useState, useEffect } from "react";
import { User, LogOut, Users } from "lucide-react"; // Importing the Users icon
import { auth, db } from "../firebase"; // Firebase imports
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore"; // Firestore data fetching

const SidebarItem = ({ text, active, onClick, Icon }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100 ${active ? "bg-blue-200" : ""}`} onClick={() => onClick(text)}>
    <Icon size={24} className="text-gray-500" />
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function HRDashboard() {
  const [selectedItem, setSelectedItem] = useState("Joinees");
  const [newHires, setNewHires] = useState([]);
  const navigate = useNavigate();

  // Fetch New Hire data from Firestore
  useEffect(() => {
    const fetchNewHires = async () => {
      const querySnapshot = await getDocs(collection(db, "newHires"));
      const hiresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewHires(hiresList);
    };
    fetchNewHires();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Document Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newHires.map((hire) => (
                    <tr key={hire.id}>
                      <td className="px-4 py-2 border">{hire.name}</td>
                      <td className="px-4 py-2 border">{hire.documentStatus || "Pending"}</td>
                      <td className="px-4 py-2 border">
                        <button onClick={() => alert("Approve functionality here")} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                          Approve
                        </button>
                        <button onClick={() => alert("Reject functionality here")} className="bg-red-500 text-white px-3 py-1 rounded">
                          Reject
                        </button>
                      </td>
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
